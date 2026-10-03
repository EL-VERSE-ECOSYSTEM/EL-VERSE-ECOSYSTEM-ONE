package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type WorkflowNode struct {
	ID     string                 `json:"id"`
	Type   string                 `json:"type"`
	Config map[string]interface{} `json:"config"`
}

type WorkflowEdge struct {
	From string `json:"from"`
	To   string `json:"to"`
}

type WorkflowDef struct {
	Name    string         `json:"name"`
	Trigger map[string]string `json:"trigger"`
	Nodes   []WorkflowNode `json:"nodes"`
	Edges   []WorkflowEdge `json:"edges"`
}

func main() {
	http.HandleFunc("/v1/automation/run", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var wf WorkflowDef
		if err := json.NewDecoder(r.Body).Decode(&wf); err != nil {
			wf = WorkflowDef{
				Name: "Sample DAG Workflow",
				Trigger: map[string]string{"type": "event", "event": "user.enrolled"},
				Nodes: []WorkflowNode{
					{ID: "n1", Type: "ai.prompt", Config: map[string]interface{}{"persona": "menato"}},
					{ID: "n2", Type: "notify", Config: map[string]interface{}{"channel": "email"}},
				},
				Edges: []WorkflowEdge{{From: "n1", To: "n2"}},
			}
		}
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "success",
			"workflow": wf.Name,
			"execution_id": "run-99823",
			"executed_nodes": len(wf.Nodes),
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10004"
	}
	fmt.Printf("Automation Service listening on :%s\n", port)
	http.ListenAndServe(":"+port, nil)
}
