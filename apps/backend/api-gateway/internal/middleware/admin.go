package middleware

import (
	"github.com/gofiber/fiber/v2"
)

func RequireAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(map[string]interface{})
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		// Check direct role claim
		role, _ := user["role"].(string)

		// Also check Supabase app_metadata.user_role per Blueprint v3.0.0
		if appMeta, hasMeta := user["app_metadata"].(map[string]interface{}); hasMeta {
			if metaRole, okMeta := appMeta["user_role"].(string); okMeta && metaRole != "" {
				role = metaRole
			}
		}

		if role != "admin" && role != "super_admin" && role != "staff" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Admin access required",
			})
		}

		return c.Next()
	}
}
