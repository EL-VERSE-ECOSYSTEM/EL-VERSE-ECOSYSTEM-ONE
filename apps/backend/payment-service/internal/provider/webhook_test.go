package provider

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"os"
	"testing"
)

func TestVerifyPaystackWebhook(t *testing.T) {
	secret := "test_paystack_secret"
	os.Setenv("PAYSTACK_SECRET_KEY", secret)
	defer os.Unsetenv("PAYSTACK_SECRET_KEY")

	rawBody := []byte(`{"event":"charge.success","data":{"id":12345,"reference":"ref_123","amount":500000}}`)

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

func TestVerifyPaystackWebhook_MissingSecret(t *testing.T) {
	os.Unsetenv("PAYSTACK_SECRET_KEY")
	rawBody := []byte(`{"event":"charge.success"}`)
	if VerifyPaystackWebhook(rawBody, "any_signature") {
		t.Errorf("Expected false when PAYSTACK_SECRET_KEY is empty")
	}
}
