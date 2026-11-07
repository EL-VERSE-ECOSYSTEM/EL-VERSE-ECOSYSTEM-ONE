package provider

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"os"
)

// VerifyPaystackWebhook validates the webhook signature from Paystack.
// Paystack signs the raw request body using HMAC SHA-512 with the secret key.
func VerifyPaystackWebhook(rawBody []byte, signature string) bool {
	secret := os.Getenv("PAYSTACK_SECRET_KEY")
	if secret == "" {
		return false
	}
	mac := hmac.New(sha512.New, []byte(secret))
	mac.Write(rawBody)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}
