package main

import (
	"log"
	"time"

	"github.com/elverse/api-gateway/internal/config"
	"github.com/elverse/api-gateway/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	cfg := config.LoadConfig()

	app := fiber.New(fiber.Config{
		AppName: "EL VERSE API Gateway",
	})

	// Middleware registration order
	app.Use(logger.New())
	app.Use(requestid.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: cfg.AllowedOrigins,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
	}))
	app.Use(middleware.JWTMiddleware(cfg.JWTSecret))

	// Routes
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "api-gateway"})
	})

	app.Post("/v1/auth/login", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Auth Login Proxy Placeholder"})
	})

	app.Post("/v1/webhooks/korapay", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "proxied to payment-service"})
	})

	app.Post("/v1/webhooks/paystack", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "proxied to payment-service"})
	})

	log.Printf("API Gateway listening on 0.0.0.0:%s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start gateway: %v", err)
	}
}
