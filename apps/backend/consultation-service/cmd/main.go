package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "consultation-service"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10005"
	}
	fmt.Printf("consultation-service listening on :%s\n", port)
	http.ListenAndServe(":"+port, nil)
}
