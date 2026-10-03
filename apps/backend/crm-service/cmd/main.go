package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "10006"
	}
	fmt.Printf("crm-service listening on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
