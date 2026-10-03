package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

type Deal struct {
	ID    string  `json:"id"`
	Title string  `json:"title"`
	Value float64 `json:"value"`
	Stage string  `json:"stage"`
}

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "crm-service"})
	})

	http.HandleFunc("/v1/crm/deals", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		deals := []Deal{
			{ID: "d1", Title: "Enterprise SaaS License", Value: 45000, Stage: "qualified"},
			{ID: "d2", Title: "Custom MVP Development", Value: 25000, Stage: "proposal"},
		}
		json.NewEncoder(w).Encode(deals)
	})

	http.HandleFunc("/v1/crm/tickets/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		path := r.URL.Path
		if strings.HasSuffix(path, "/sla/pause") {
			json.NewEncoder(w).Encode(map[string]any{
				"status":    "paused",
				"paused_at": time.Now().UTC(),
			})
			return
		}
		if strings.HasSuffix(path, "/sla/resume") {
			json.NewEncoder(w).Encode(map[string]any{
				"status": "resumed",
				"ok":     true,
			})
			return
		}
		http.Error(w, "Not found", http.StatusNotFound)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10006"
	}
	fmt.Printf("crm-service listening on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
