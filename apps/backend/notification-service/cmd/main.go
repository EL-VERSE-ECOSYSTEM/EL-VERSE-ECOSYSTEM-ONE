package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/google/uuid"
)

type Notification struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"created_at"`
}

type NotificationStore struct {
	mu            sync.RWMutex
	notifications map[string][]Notification
}

func newStore() *NotificationStore {
	return &NotificationStore{
		notifications: make(map[string][]Notification),
	}
}

// Persist notification to Supabase REST endpoint if configured
func persistNotificationToSupabase(notif Notification) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if supabaseURL == "" || supabaseKey == "" {
		return
	}

	endpoint := fmt.Sprintf("%s/rest/v1/notifications", supabaseURL)
	payload, err := json.Marshal(notif)
	if err != nil {
		return
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(payload))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=minimal")

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err == nil && resp != nil {
		resp.Body.Close()
	}
}

func main() {
	app := fiber.New()
	app.Use(cors.New())

	store := newStore()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "notification-service"})
	})

	// Create Notification
	app.Post("/v1/notifications", func(c *fiber.Ctx) error {
		var req struct {
			UserID string `json:"user_id"`
			Title  string `json:"title"`
			Body   string `json:"body"`
		}
		if err := c.BodyParser(&req); err != nil || req.UserID == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
		}

		notif := Notification{
			ID:        uuid.New().String(),
			UserID:    req.UserID,
			Title:     req.Title,
			Body:      req.Body,
			Read:      false,
			CreatedAt: time.Now(),
		}

		store.mu.Lock()
		store.notifications[req.UserID] = append(store.notifications[req.UserID], notif)
		store.mu.Unlock()

		// Asynchronously persist to Supabase if configured
		go persistNotificationToSupabase(notif)

		return c.Status(fiber.StatusCreated).JSON(notif)
	})

	// Get User Notifications
	app.Get("/v1/notifications/:user_id", func(c *fiber.Ctx) error {
		userID := c.Params("user_id")
		store.mu.RLock()
		userNotifs, exists := store.notifications[userID]
		store.mu.RUnlock()

		if !exists {
			userNotifs = []Notification{}
		}
		return c.JSON(userNotifs)
	})

	// Mark Notification Read
	app.Patch("/v1/notifications/:id/read", func(c *fiber.Ctx) error {
		notifID := c.Params("id")
		store.mu.Lock()
		defer store.mu.Unlock()

		for userID, list := range store.notifications {
			for i, notif := range list {
				if notif.ID == notifID {
					store.notifications[userID][i].Read = true
					return c.JSON(store.notifications[userID][i])
				}
			}
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notification not found"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10005"
	}
	fmt.Printf("notification-service listening on :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
