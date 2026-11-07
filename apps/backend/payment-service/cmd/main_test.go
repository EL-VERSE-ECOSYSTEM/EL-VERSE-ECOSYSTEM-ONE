package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func TestPaystackWebhookHandler(t *testing.T) {
	secret := "test_secret_paystack"
	os.Setenv("PAYSTACK_SECRET_KEY", secret)
	defer os.Unsetenv("PAYSTACK_SECRET_KEY")

	payload := map[string]interface{}{
		"event": "charge.success",
		"data": map[string]interface{}{
			"id":        99999,
			"reference": "test_ref_12345",
			"status":    "success",
			"amount":    500000,
		},
	}
	bodyBytes, _ := json.Marshal(payload)

	mac := hmac.New(sha512.New, []byte(secret))
	mac.Write(bodyBytes)
	sig := hex.EncodeToString(mac.Sum(nil))

	// First request: should be accepted
	req := httptest.NewRequest(http.MethodPost, "/v1/webhooks/paystack", bytes.NewReader(bodyBytes))
	req.Header.Set("x-paystack-signature", sig)
	w := httptest.NewRecorder()

	handlePaystackWebhook(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}
	if w.Body.String() != "Accepted" {
		t.Fatalf("Expected 'Accepted', got '%s'", w.Body.String())
	}

	// Second request with same payload: Idempotency should return 'Already processed'
	req2 := httptest.NewRequest(http.MethodPost, "/v1/webhooks/paystack", bytes.NewReader(bodyBytes))
	req2.Header.Set("x-paystack-signature", sig)
	w2 := httptest.NewRecorder()

	handlePaystackWebhook(w2, req2)
	if w2.Code != http.StatusOK {
		t.Fatalf("Expected status 200 on duplicate, got %d", w2.Code)
	}
	if w2.Body.String() != "Already processed" {
		t.Fatalf("Expected 'Already processed' on duplicate, got '%s'", w2.Body.String())
	}
}

func TestPaystackWebhookHandler_InvalidSignature(t *testing.T) {
	secret := "test_secret_paystack"
	os.Setenv("PAYSTACK_SECRET_KEY", secret)
	defer os.Unsetenv("PAYSTACK_SECRET_KEY")

	bodyBytes := []byte(`{"event":"charge.success"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/webhooks/paystack", bytes.NewReader(bodyBytes))
	req.Header.Set("x-paystack-signature", "invalid_signature")
	w := httptest.NewRecorder()

	handlePaystackWebhook(w, req)
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("Expected status 401 Unauthorized, got %d", w.Code)
	}
}
