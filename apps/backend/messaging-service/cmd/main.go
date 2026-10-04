package main

import (
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Hub struct {
	clients   map[*websocket.Conn]bool
	broadcast chan []byte
	mu        sync.Mutex
}

func newHub() *Hub {
	return &Hub{
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan []byte),
	}
}

func (h *Hub) run() {
	for {
		msg := <-h.broadcast
		h.mu.Lock()
		for client := range h.clients {
			if err := client.WriteMessage(websocket.TextMessage, msg); err != nil {
				client.Close()
				delete(h.clients, client)
			}
		}
		h.mu.Unlock()
	}
}

func main() {
	app := fiber.New()
	app.Use(cors.New())

	hub := newHub()
	go hub.run()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "messaging-service"})
	})

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		hub.mu.Lock()
		hub.clients[c] = true
		hub.mu.Unlock()

		defer func() {
			hub.mu.Lock()
			delete(hub.clients, c)
			hub.mu.Unlock()
			c.Close()
		}()

		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				break
			}
			hub.broadcast <- msg
		}
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "10005"
	}
	fmt.Printf("messaging-service listening on :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
