package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type PersonaConfig struct {
	Name       string   `json:"name"`
	Arm        string   `json:"arm"`
	Role       string   `json:"role"`
	Scope      string   `json:"scope"`
	Tools      []string `json:"tools"`
	SystemMsg  string   `json:"system_msg"`
}

var Personas = map[string]PersonaConfig{
	"menato": {
		Name:      "Menato",
		Arm:       "ELITES",
		Role:      "Learning companion and mentor matcher",
		Scope:     "Course recommendation, mentor matching, learning path generation, content Q&A",
		Tools:     []string{"search_courses", "get_mentor_profile", "generate_learning_path", "enroll_course"},
		SystemMsg: "You are Menato, the official AI mentor for ELITES.",
	},
	"spectre": {
		Name:      "Spectre",
		Arm:       "ELSPACE",
		Role:      "Freelance matching and project scoping assistant",
		Scope:     "Freelancer-client matching, proposal drafting, project scoping, dispute mediation",
		Tools:     []string{"search_freelancers", "draft_proposal", "estimate_project", "open_dispute"},
		SystemMsg: "You are Spectre, the freelance AI assistant for ELSPACE.",
	},
	"nelly": {
		Name:      "Nelly",
		Arm:       "NEXEL",
		Role:      "Community moderator and feed curator",
		Scope:     "Content moderation, feed ranking, community summarization, spam detection",
		Tools:     []string{"moderate_content", "rank_feed", "summarize_thread", "flag_spam"},
		SystemMsg: "You are Nelly, the community AI moderator for NEXEL.",
	},
	"elly": {
		Name:      "Elly",
		Arm:       "ELCODERS + EL ACCESS + AI Agent",
		Role:      "General platform assistant and code reviewer",
		Scope:     "Code review, project estimation, internship matching, general platform Q&A",
		Tools:     []string{"review_code", "estimate_project", "match_internship", "query_platform"},
		SystemMsg: "You are Elly, the master AI assistant across EL VERSE.",
	},
}

func main() {
	http.HandleFunc("/v1/ai/chat", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		persona := r.URL.Query().Get("persona")
		if persona == "" {
			persona = "elly"
		}
		p, exists := Personas[persona]
		if !exists {
			http.Error(w, "Unknown persona", http.StatusBadRequest)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{
			"persona": p,
			"response": fmt.Sprintf("[%s AI Agent]: Hello! How can I assist you in the %s ecosystem today?", p.Name, p.Arm),
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "10003"
	}
	fmt.Printf("AI Service listening on :%s\n", port)
	http.ListenAndServe(":"+port, nil)
}
