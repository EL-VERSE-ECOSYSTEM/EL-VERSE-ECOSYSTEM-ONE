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
	"github.com/gofiber/fiber/v2/middleware/proxy"
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

	// Proxy mappings
	proxyService := func(target string) fiber.Handler {
		return func(c *fiber.Ctx) error {
			path := c.Path()
			url := target + path
			if len(c.Request().URI().QueryString()) > 0 {
				url += "?" + string(c.Request().URI().QueryString())
			}
			if err := proxy.Do(c, url); err != nil {
				return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"error": "Service unavailable", "target": target})
			}
			return nil
		}
	}

	app.All("/v1/auth/*", proxyService("http://localhost:10001"))
	app.All("/v1/payments/*", proxyService("http://localhost:10002"))
	app.All("/v1/webhooks/*", proxyService("http://localhost:10002"))
	app.All("/v1/ai/*", proxyService("http://localhost:10003"))
	app.All("/v1/automation/*", proxyService("http://localhost:10004"))
	app.All("/v1/messages/*", proxyService("http://localhost:10005"))
	app.All("/v1/crm/*", proxyService("http://localhost:10006"))
	app.All("/v1/courses/*", proxyService("http://localhost:10007"))
	app.All("/v1/jobs/*", proxyService("http://localhost:10008"))
	app.All("/v1/analytics/*", middleware.AdminOnlyMiddleware(), proxyService("http://localhost:10009"))

	log.Printf("API Gateway listening on 0.0.0.0:%s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start gateway: %v", err)
	}
}
