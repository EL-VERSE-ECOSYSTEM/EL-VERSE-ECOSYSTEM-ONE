package idempotency

import (
	"sync"
	"time"
)

type MemoryStore struct {
	mu     sync.Mutex
	events map[string]time.Time
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		events: make(map[string]time.Time),
	}
}

func (s *MemoryStore) IsProcessed(eventID string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if t, exists := s.events[eventID]; exists {
		if time.Since(t) < 72*time.Hour {
			return true
		}
	}
	s.events[eventID] = time.Now()
	return false
}
