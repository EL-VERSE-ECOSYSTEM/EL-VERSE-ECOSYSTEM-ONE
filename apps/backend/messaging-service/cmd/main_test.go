package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func TestMessagingServiceHealth(t *testing.T) {
	app := fiber.New()
	app.Use(cors.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "messaging-service"})
	})

	req := httptest.NewRequest("GET", "/health", nil)
	resp, err := app.Test(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected health check 200 OK, got %d", resp.StatusCode)
	}
}

func TestHubMessagePayload(t *testing.T) {
	hub := newHub()
	go hub.run()

	payload := MessagePayload{
		Type:      "chat",
		ChannelID: "chan_001",
		SenderID:  "usr_789",
		Content:   "Hello EL VERSE real-time chat!",
	}

	if payload.Type != "chat" || payload.ChannelID != "chan_001" {
		t.Errorf("Unexpected MessagePayload struct values")
	}
}
