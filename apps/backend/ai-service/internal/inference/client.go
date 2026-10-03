package inference

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
)

type InferenceClient struct {
	baseURL   string
	secretKey string
	http      *http.Client
}

func NewInferenceClient() *InferenceClient {
	baseURL := os.Getenv("AI_INFERENCE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8000"
	}
	secretKey := os.Getenv("AI_INTERNAL_KEY")
	if secretKey == "" {
		secretKey = "ai_internal_secret_key"
	}
	return &InferenceClient{
		baseURL:   baseURL,
		secretKey: secretKey,
		http:      &http.Client{},
	}
}

type ChatRequest struct {
	Persona string           `json:"persona"`
	Message string           `json:"message"`
	History []map[string]any `json:"history"`
	Context map[string]any   `json:"context"`
}

func (c *InferenceClient) StreamChat(req ChatRequest) (*http.Response, error) {
	body, _ := json.Marshal(req)
	httpReq, err := http.NewRequest("POST", c.baseURL+"/chat/stream", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-Internal-Key", c.secretKey)

	return c.http.Do(httpReq)
}
