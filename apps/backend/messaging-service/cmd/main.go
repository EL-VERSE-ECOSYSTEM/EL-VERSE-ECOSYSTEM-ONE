package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type MessagePayload struct {
	Type      string    `json:"type"`       // "chat", "join_channel", "leave_channel", "ping"
	ChannelID string    `json:"channel_id"` // Target conversation/channel ID
	SenderID  string    `json:"sender_id"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
}

type Client struct {
	conn     *websocket.Conn
	channels map[string]bool
	mu       sync.Mutex
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan MessagePayload
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan MessagePayload),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.conn.Close()
			}
			h.mu.Unlock()
		case msg := <-h.broadcast:
			h.mu.RLock()
			msgBytes, err := json.Marshal(msg)
			if err == nil {
				for client := range h.clients {
					client.mu.Lock()
					inChannel := client.channels[msg.ChannelID] || msg.ChannelID == ""
					client.mu.Unlock()

					if inChannel {
						_ = client.conn.WriteMessage(websocket.TextMessage, msgBytes)
					}
				}
			}
			h.mu.RUnlock()
		}
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
		client := &Client{
			conn:     c,
			channels: make(map[string]bool),
		}
		hub.register <- client

		defer func() {
			hub.unregister <- client
		}()

		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				break
			}

			var payload MessagePayload
			if err := json.Unmarshal(message, &payload); err != nil {
				continue
			}

			payload.Timestamp = time.Now()

			switch payload.Type {
			case "join_channel":
				client.mu.Lock()
				client.channels[payload.ChannelID] = true
				client.mu.Unlock()
			case "leave_channel":
				client.mu.Lock()
				delete(client.channels, payload.ChannelID)
				client.mu.Unlock()
			case "chat":
				hub.broadcast <- payload
			}
		}
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "10005"
	}
	fmt.Printf("messaging-service listening on :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
