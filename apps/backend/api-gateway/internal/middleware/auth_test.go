package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func TestJWTMiddleware(t *testing.T) {
	secret := "test_jwt_secret"
	app := fiber.New()
	app.Use(JWTMiddleware(secret))

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})
	app.Get("/v1/protected", func(c *fiber.Ctx) error {
		return c.SendString("protected")
	})

	// 1. Public route check
	req := httptest.NewRequest("GET", "/health", nil)
	resp, err := app.Test(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Errorf("Expected 200 OK for public route, got %d", resp.StatusCode)
	}

	// 2. Protected route without Auth header
	req = httptest.NewRequest("GET", "/v1/protected", nil)
	resp, err = app.Test(req)
	if err != nil || resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected 401 Unauthorized, got %d", resp.StatusCode)
	}

	// 3. Protected route with valid token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "user_123",
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	tokenStr, _ := token.SignedString([]byte(secret))

	req = httptest.NewRequest("GET", "/v1/protected", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	resp, err = app.Test(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Errorf("Expected 200 OK for valid JWT token, got %d", resp.StatusCode)
	}
}
