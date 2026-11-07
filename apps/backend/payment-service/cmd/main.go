package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/elverse/payment-service/internal/idempotency"
	"github.com/elverse/payment-service/internal/provider"
)

var store = idempotency.NewMemoryStore()

type InitializeCheckoutRequest struct {
	Email       string `json:"email"`
	Amount      int64  `json:"amount"` // Amount in lowest currency denomination (e.g. kobo or cents)
	Currency    string `json:"currency,omitempty"`
	Reference   string `json:"reference,omitempty"`
	CallbackURL string `json:"callback_url,omitempty"`
}

type PaystackInitializeResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		AuthorizationURL string `json:"authorization_url"`
		AccessCode       string `json:"access_code"`
		Reference        string `json:"reference"`
	} `json:"data"`
}

type PaystackVerifyResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		ID        int64  `json:"id"`
		Status    string `json:"status"`
		Reference string `json:"reference"`
		Amount    int64  `json:"amount"`
		GatewayResponse string `json:"gateway_response"`
		Channel   string `json:"channel"`
		Currency  string `json:"currency"`
		Customer  struct {
			Email string `json:"email"`
		} `json:"customer"`
	} `json:"data"`
}

func handlePaystackInitialize(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req InitializeCheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Amount <= 0 {
		http.Error(w, "Email and positive amount are required", http.StatusBadRequest)
		return
	}

	secretKey := os.Getenv("PAYSTACK_SECRET_KEY")
	if secretKey == "" {
		http.Error(w, "Payment provider not configured", http.StatusInternalServerError)
		return
	}

	// Idempotency check if reference provided
	if req.Reference != "" && store.IsProcessed("init:" + req.Reference) {
		http.Error(w, "Duplicate payment initialization", http.StatusConflict)
		return
	}

	paystackReqBody, err := json.Marshal(req)
	if err != nil {
		http.Error(w, "Failed to marshal paystack request", http.StatusInternalServerError)
		return
	}

	httpReq, err := http.NewRequestWithContext(r.Context(), http.MethodPost, "https://api.paystack.co/transaction/initialize", bytes.NewBuffer(paystackReqBody))
	if err != nil {
		http.Error(w, "Failed to create paystack request", http.StatusInternalServerError)
		return
	}
	httpReq.Header.Set("Authorization", "Bearer "+secretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		http.Error(w, "Error contacting Paystack", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read Paystack response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}

func handlePaystackCallback(w http.ResponseWriter, r *http.Request) {
	reference := r.URL.Query().Get("reference")
	if reference == "" {
		reference = r.URL.Query().Get("trxref")
	}

	if reference == "" {
		http.Error(w, "Missing transaction reference", http.StatusBadRequest)
		return
	}

	secretKey := os.Getenv("PAYSTACK_SECRET_KEY")
	if secretKey == "" {
		http.Error(w, "Payment provider not configured", http.StatusInternalServerError)
		return
	}

	// Real-time verification with Paystack API
	reqURL := fmt.Sprintf("https://api.paystack.co/transaction/verify/%s", reference)
	httpReq, err := http.NewRequestWithContext(r.Context(), http.MethodGet, reqURL, nil)
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}
	httpReq.Header.Set("Authorization", "Bearer "+secretKey)

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		http.Error(w, "Error verifying transaction with Paystack", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response", http.StatusInternalServerError)
		return
	}

	var verifyResp PaystackVerifyResponse
	if err := json.Unmarshal(respBody, &verifyResp); err == nil && verifyResp.Status && verifyResp.Data.Status == "success" {
		// Idempotent recording of verified payment
		store.IsProcessed("paystack:" + reference)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}

func handlePaystackWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

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

	var payload struct {
		Event string `json:"event"`
		Data  struct {
			ID        interface{} `json:"id"`
			Reference string      `json:"reference"`
			Status    string      `json:"status"`
			Amount    int64       `json:"amount"`
		} `json:"data"`
	}

	if err := json.Unmarshal(rawBody, &payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	// Idempotency: Use reference or ID as the deduplication key
	dedupKey := payload.Data.Reference
	if dedupKey == "" && payload.Data.ID != nil {
		dedupKey = fmt.Sprintf("%v", payload.Data.ID)
	}

	if dedupKey != "" {
		eventKey := fmt.Sprintf("%s:%s", payload.Event, dedupKey)
		if store.IsProcessed(eventKey) {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Already processed"))
			return
		}
	}

	// Event processing in real time (e.g. charge.success)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Accepted"))
}

func main() {
	http.HandleFunc("/v1/webhooks/paystack", handlePaystackWebhook)
	http.HandleFunc("/v1/payments/initialize", handlePaystackInitialize)
	http.HandleFunc("/v1/payments/callback", handlePaystackCallback)
	http.HandleFunc("/v1/payments/verify", handlePaystackCallback)

	port := os.Getenv("PORT")
	if port == "" {
		port = "10002"
	}
	fmt.Printf("Payment Service listening on :%s\n", port)
	http.ListenAndServe(":"+port, nil)
}
