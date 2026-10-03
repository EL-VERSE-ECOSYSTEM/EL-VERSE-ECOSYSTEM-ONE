package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/elverse/ai-service/internal/inference"
)

type ChatRequest struct {
	Persona string           `json:"persona"`
	Message string           `json:"message"`
	History []map[string]any `json:"history"`
	Context map[string]any   `json:"context"`
}

func main() {
	client := inference.NewInferenceClient()

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "ai-service"})
	})

	http.HandleFunc("/v1/ai/chat/stream", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req ChatRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		resp, err := client.StreamChat(inference.ChatRequest{
			Persona: req.Persona,
			Message: req.Message,
			History: req.History,
			Context: req.Context,
		})
		if err != nil {
			fmt.Fprintf(w, "data: {\"type\": \"error\", \"error\": \"Inference service unavailable\"}\n\n")
			return
		}
		defer resp.Body.Close()

		flusher, ok := w.(http.Flusher)
		scanner := bufio.NewScanner(resp.Body)
		for scanner.Scan() {
			fmt.Fprintf(w, "%s\n", scanner.Text())
			if ok {
				flusher.Flush()
			}
		}
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10003"
	}
	fmt.Printf("ai-service listening on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
