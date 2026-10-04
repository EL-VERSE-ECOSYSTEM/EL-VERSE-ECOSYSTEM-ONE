package provider

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"os"
	"testing"
)

func TestVerifyPaystackWebhook(t *testing.T) {
	secret := "test_paystack_secret"
	os.Setenv("PAYSTACK_SECRET_KEY", secret)
	defer os.Unsetenv("PAYSTACK_SECRET_KEY")

	rawBody := []byte(`{"event":"charge.success","data":{"id":12345,"amount":500000}}`)

	mac := hmac.New(sha512.New, []byte(secret))
	mac.Write(rawBody)
	validSig := hex.EncodeToString(mac.Sum(nil))

	if !VerifyPaystackWebhook(rawBody, validSig) {
		t.Errorf("Expected Paystack webhook signature to be valid")
	}

	if VerifyPaystackWebhook(rawBody, "invalid_signature") {
		t.Errorf("Expected Paystack webhook signature to be invalid")
	}
}

func TestVerifyKorapayWebhook(t *testing.T) {
	secret := "test_korapay_secret"
	os.Setenv("KORAPAY_SECRET_KEY", secret)
	defer os.Unsetenv("KORAPAY_SECRET_KEY")

	dataMap := map[string]interface{}{
		"reference": "kora_ref_123",
		"amount":    5000,
		"status":    "success",
	}

	payload := map[string]interface{}{
		"event": "charge.success",
		"data":  dataMap,
	}

	rawBody, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("Failed to marshal payload: %v", err)
	}

	dataBytes, _ := json.Marshal(dataMap)
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(dataBytes)
	validSig := hex.EncodeToString(mac.Sum(nil))

	if !VerifyKorapayWebhook(rawBody, validSig) {
		t.Errorf("Expected Korapay webhook signature to be valid")
	}

	if VerifyKorapayWebhook(rawBody, "invalid_signature") {
		t.Errorf("Expected Korapay webhook signature to be invalid")
	}
}
