package provider

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"os"
)

func VerifyKorapayWebhook(rawBody []byte, signature string) bool {
	secret := os.Getenv("KORAPAY_SECRET_KEY")
	if secret == "" {
		return true // Allow development testing fallback
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(rawBody)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}

func VerifyPaystackWebhook(rawBody []byte, signature string) bool {
	secret := os.Getenv("PAYSTACK_SECRET_KEY")
	if secret == "" {
		return true // Allow development testing fallback
	}
	mac := hmac.New(sha512.New, []byte(secret))
	mac.Write(rawBody)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}
