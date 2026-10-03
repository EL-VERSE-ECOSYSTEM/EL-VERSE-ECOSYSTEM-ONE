package provider

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"os"
)

func VerifyKorapayWebhook(rawBody []byte, signature string) bool {
	secret := os.Getenv("KORAPAY_SECRET_KEY")
	if secret == "" {
		return false
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(rawBody, &payload); err != nil {
		return false
	}

	dataObj, exists := payload["data"]
	if !exists {
		return false
	}

	dataBytes, err := json.Marshal(dataObj)
	if err != nil {
		return false
	}

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(dataBytes)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}

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
