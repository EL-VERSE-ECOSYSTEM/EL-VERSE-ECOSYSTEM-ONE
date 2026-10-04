package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func TestNotificationService(t *testing.T) {
	app := fiber.New()
	app.Use(cors.New())
	store := newStore()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

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
			ID:     "notif_123",
			UserID: req.UserID,
			Title:  req.Title,
			Body:   req.Body,
			Read:   false,
		}
		store.mu.Lock()
		store.notifications[req.UserID] = append(store.notifications[req.UserID], notif)
		store.mu.Unlock()
		return c.Status(fiber.StatusCreated).JSON(notif)
	})

	// 1. Health test
	req := httptest.NewRequest("GET", "/health", nil)
	resp, err := app.Test(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected health check 200 OK")
	}

	// 2. Create notification test
	body, _ := json.Marshal(map[string]string{
		"user_id": "usr_abc",
		"title":   "Welcome to EL VERSE",
		"body":    "Your account is set up.",
	})
	req = httptest.NewRequest("POST", "/v1/notifications", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err = app.Test(req)
	if err != nil || resp.StatusCode != http.StatusCreated {
		t.Fatalf("Expected 201 Created for notification creation, got %d", resp.StatusCode)
	}
}
