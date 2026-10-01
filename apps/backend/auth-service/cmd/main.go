package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	Email       string                 `json:"email"`
	Role        string                 `json:"role"`
	AppMetadata map[string]interface{} `json:"app_metadata"`
	jwt.RegisteredClaims
}

func IssueToken(userID, email, role, tenantID, secret string) (string, error) {
	claims := JWTClaims{
		Email: email,
		Role:  role,
		AppMetadata: map[string]interface{}{
			"tenant_id": tenantID,
			"org_role":  "member",
		},
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func main() {
	http.HandleFunc("/auth/token", func(w http.ResponseWriter, r *http.Request) {
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "default-secret-key"
		}
		tokenStr, err := IssueToken("user-123", "learner@elverse.com", "learner", "org-456", secret)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"access_token": tokenStr})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
	}
	fmt.Printf("Auth Service listening on :%s\n", port)
	http.ListenAndServe(":"+port, nil)
}
