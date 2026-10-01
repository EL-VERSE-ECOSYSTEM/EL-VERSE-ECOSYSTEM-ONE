package config

import (
	"os"
)

type Config struct {
	Port           string
	JWTSecret      string
	AllowedOrigins string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "default-secret-key-change-in-prod"
	}
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "*"
	}
	return &Config{
		Port:           port,
		JWTSecret:      jwtSecret,
		AllowedOrigins: allowedOrigins,
	}
}
