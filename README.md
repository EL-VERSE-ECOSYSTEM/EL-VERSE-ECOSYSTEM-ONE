# 🌌 EL VERSE ECOSYSTEM — Master Platform Architecture & Specification

> **Version:** 2.0 | **Status:** Approved | **Architecture:** Monorepo (Turborepo + Go Microservices + Next.js 15 + Python AI Inference + Supabase)

---

## 🚀 Overview

The **EL VERSE ECOSYSTEM** is a unified technology talent platform engineered to connect every stage of the technology career journey — learning, interning, freelancing, building software, and community — through five interconnected arms.

### 🎯 The Core Problem & Solution

* **The Problem:** A developer spends hours daily context-switching across freelancing portals, job boards, learning platforms, social networks, and payment channels to find work, learn skills, and receive payouts.
* **The Solution:** One platform. Five arms. Endless possibilities.

---

## 🏛️ The Five Core Arms

```
                                 ┌───────────────────────────────┐
                                 │     EL VERSE ECOSYSTEM        │
                                 └──────────────┬────────────────┘
                                                │
       ┌──────────────────┬─────────────────────┼─────────────────────┬──────────────────┐
       ▼                  ▼                     ▼                     ▼                  ▼
┌──────────────┐   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐   ┌──────────────┐
│   ELITES     │   │   ELCODERS   │      │   ELSPACE    │      │  EL ACCESS   │   │    NEXEL     │
│ Mentorship & │   │ Software Dev │      │  Freelance   │      │ Internships  │   │  Community   │
│   Learning   │   │  & Delivery  │      │ Marketplace  │      │ & Talent Hub │   │  & Content   │
└──────────────┘   └──────────────┘      └──────────────┘      └──────────────┘   └──────────────┘
```

1. **ELITES (`#8B5CF6`) — Mentorship & Learning**
   - Per-stack skill progression from Rank E (Novice) to Rank S (Elite).
   - 3D IDE simulator, interactive courses, tutor mentorship, and AI-powered learning paths.
   - **AI Agent:** Menato (`search_courses`, `generate_learning_path`, `enroll_course`).

2. **ELCODERS (`#0066FF`) — Software Development & Delivery**
   - Custom software scoping, product marketplace, and client-developer workspace.
   - Automated scoping, tech matrix matching, and milestone-based project execution.
   - **AI Agent:** Elly (`review_code`, `estimate_project`).

3. **ELSPACE (`#10B981`) — Freelance Marketplace**
   - Proposal drafting, gig postings, milestone escrow, and automated payouts.
   - Smart talent matching and dispute resolution workflows.
   - **AI Agent:** Spectre (`find_freelancers`, `draft_proposal`, `estimate_project`).

4. **EL ACCESS (`#F97316`) — Internship & Talent Placement**
   - Verified student applications, company dashboard, task tracking, and placement matching.
   - **AI Agent:** Elly (`match_internship`, `create_support_ticket`).

5. **NEXEL (`#EC4899`) — Social & Tech Community**
   - Topic channels, real-time messaging, feed ranking, and creator subscriptions.
   - **AI Agent:** Nelly (`moderate_content`, `rank_feed`, `summarize_thread`).

---

## 🤖 Specialized AI Agents

| Agent | Arm | Primary Functions | Key Tools | Human Approval Required |
| :--- | :--- | :--- | :--- | :--- |
| **Menato** | ELITES | Learning path creation, course search & enrollment | `search_courses`, `generate_learning_path`, `enroll_course` | `enroll_course` |
| **Elly** | ELCODERS & EL ACCESS | Code reviews, project estimation, internship matching, ticket creation | `review_code`, `estimate_project`, `match_internship`, `create_support_ticket` | `create_support_ticket` |
| **Spectre** | ELSPACE | Freelancer discovery, proposal drafting, project estimation | `find_freelancers`, `draft_proposal`, `estimate_project` | None |
| **Nelly** | NEXEL | Feed ranking, thread summarization, content moderation | `moderate_content`, `rank_feed`, `summarize_thread` | None |

---

## 🔒 Security Architecture (Hybrid RBAC + ABAC)

The EL VERSE ECOSYSTEM implements defense-in-depth authorization using a **hybrid RBAC + ABAC model**:
- **RBAC (Role-Based Access Control):** Structural baseline permissions (e.g., `elcoders.project.read`, `elites.course.publish`).
- **ABAC (Attribute-Based Access Control):** Contextual refinements evaluating subject, resource, action, and environment attributes (e.g., Learner Rank checks, time-window constraints, client tier access limits).

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Request Received │ ──▶ │    RBAC Check    │ ──▶ │    ABAC Check    │ ──▶ │ Decision Result  │
│  (Auth Header)   │     │ (Base Permission)│     │(Context Policies)│     │  (Allow / Deny)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Payment Webhook Security
- **Paystack Webhook Verification:** Verified using HMAC SHA-512 over the raw request body.
- **Korapay Webhook Verification:** Verified using HMAC SHA-256 over the payload's `data` object.

---

## 🏗️ Monorepo Structure

```
elverse-ecosystem/
├── apps/
│   ├── web/                          # Next.js 15 Frontend Applications
│   │   ├── elites-web/               # ELITES Learning & Mentorship Portal
│   │   ├── elcoders-web/             # ELCODERS Client & Service Hub
│   │   ├── elspace-web/              # ELSPACE Freelance Marketplace
│   │   ├── elaccess-web/             # EL ACCESS Internship Portal
│   │   ├── nexel-web/                # NEXEL Social & Creator Web
│   │   ├── business-dashboard/       # Command Center & Executive KPI Dashboard
│   │   ├── client-portal/            # Client Project Tracking Portal
│   │   ├── developer-dashboard/      # Developer Task & Time Tracking Hub
│   │   ├── support-dashboard/        # Support Tickets & SLA Escalation Dashboard
│   │   ├── crm/                      # Customer Relationship Management
│   │   ├── admin-panel/              # Platform Administration & RBAC/ABAC Editor
│   │   ├── ai-agent/                 # AI Agent Management
│   │   ├── onboarding-site/          # Global Platform Onboarding
│   │   └── automation/               # Workflow Automation Tools
│   ├── mobile/                       # Expo Mobile Applications
│   │   ├── elites-mobile/            # ELITES Mobile App
│   │   └── nexel-mobile/             # NEXEL Mobile App
│   ├── backend/                      # Go Microservices & Python AI
│   │   ├── api-gateway/              # Fiber v3 API Gateway & JWT Auth
│   │   ├── auth-service/             # Authentication & User Profiles
│   │   ├── ai-service/               # Go AI Service Orchestrator
│   │   ├── ai-inference/             # Python FastAPI Model Routing & RAG
│   │   ├── payment-service/          # Korapay & Paystack Payment Integration
│   │   ├── messaging-service/        # WebSocket Real-Time Communication
│   │   ├── notification-service/     # Cross-Arm Multi-Channel Alerts
│   │   ├── course-service/           # ELITES Course & Progress Management
│   │   ├── job-service/              # ELSPACE & EL ACCESS Job Engine
│   │   ├── marketplace-service/      # Product & Service Marketplace
│   │   ├── dispute-service/          # Escrow & Dispute Resolution Engine
│   │   ├── crm-service/              # Enterprise CRM Operations
│   │   ├── analytics-service/        # KPI Aggregation & Materialized Refresh
│   │   ├── consultation-service/     # Discovery Calls & Booking Engine
│   │   └── automation-service/       # System Automation & Trigger Handlers
│   └── db/                           # Database Schema & Migrations
│       ├── migrations/               # Supabase PostgreSQL Migrations & RLS Policies
│       └── tests/                    # pgTAP / SQL RLS Policies Test Suite
├── packages/                         # Shared Monorepo Packages
│   ├── shared-ui/                    # Shared Design Tokens, CSS, and UI Components
│   ├── shared-types/                 # Unified TypeScript Interfaces and Models
│   ├── shared-supabase/              # Shared Supabase SSR, Client, and Admin Helpers
│   ├── shared-hooks/                 # Shared React Custom Hooks
│   ├── shared-api/                   # Shared API Clients & Fetchers
│   ├── shared-config/                # Environment & Configuration Validation
│   ├── shared-utils/                 # Common Helpers & Utility Functions
│   └── shared-db/                    # Shared DB Connectors & ORM Definitions
├── infrastructure/                   # Dockerfiles and Render Deployment Spec (`render.yaml`)
└── docs/                             # OpenAPI Specs (`openapi.yaml`) & System Specs
```

---

## 🛠️ Developer Setup & Local Execution

### Prerequisites
- **Node.js:** `>= 20.x`
- **pnpm:** `>= 9.x`
- **Go:** `>= 1.22`
- **Python:** `>= 3.11`

### Installation & Test Execution

1. **Clone the repository and install workspace dependencies:**
   ```bash
   git clone https://github.com/EL-VERSE-ECOSYSTEM/EL-VERSE-ECOSYSTEM.git
   cd EL-VERSE-ECOSYSTEM
   pnpm install
   ```

2. **Run Backend Service Tests:**
   ```bash
   # Run tests for all Go backend microservices
   for dir in apps/backend/*/; do
     if [ -f "${dir}go.mod" ]; then
       (cd "$dir" && go test ./...)
     fi
   done
   ```

3. **Start Development Infrastructure:**
   ```bash
   pnpm dev
   ```

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
