package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/elverse/payment-service/internal/idempotency"
	"github.com/elverse/payment-service/internal/provider"
)

var store = idempotency.NewMemoryStore()

func handleKorapayWebhook(w http.ResponseWriter, r *http.Request) {
	rawBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Read error", http.StatusBadRequest)
		return
	}
	sig := r.Header.Get("x-korapay-signature")
	if !provider.VerifyKorapayWebhook(rawBody, sig) {
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	var payload map[string]interface{}
	json.Unmarshal(rawBody, &payload)
	eventID, _ := payload["event_id"].(string)

	if eventID != "" && store.IsProcessed(eventID) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Already processed"))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Accepted"))
}

func handlePaystackWebhook(w http.ResponseWriter, r *http.Request) {
	rawBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Read error", http.StatusBadRequest)
		return
	}
	sig := r.Header.Get("x-paystack-signature")
	if !provider.VerifyPaystackWebhook(rawBody, sig) {
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Accepted"))
}

func main() {
	http.HandleFunc("/v1/webhooks/korapay", handleKorapayWebhook)
	http.HandleFunc("/v1/webhooks/paystack", handlePaystackWebhook)

	port := os.Getenv("PORT")
	if port == "" {
		port = "10002"
	}
	fmt.Printf("Payment Service listening on :%s\n", port)
	http.ListenAndServe(":"+port, nil)
}
