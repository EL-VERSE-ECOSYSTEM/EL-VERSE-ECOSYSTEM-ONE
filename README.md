<div align="center">

# 🌌 EL VERSE ECOSYSTEM

### *One Unified Tech Career Ecosystem. Five Interconnected Arms. Endless Possibilities.*

[![Version](https://img.shields.io/badge/Version-2.0.0--Approved-6366F1?style=for-the-badge&logo=semver&logoColor=white)](https://github.com/EL-VERSE-ECOSYSTEM/EL-VERSE-ECOSYSTEM)
[![Architecture](https://img.shields.io/badge/Architecture-Monorepo--Turborepo-000000?style=for-the-badge&logo=turbo&logoColor=white)](https://turbo.build/)
[![Backend](https://img.shields.io/badge/Backend-Go_1.23_Microservices-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![AI Engine](https://img.shields.io/badge/AI_Inference-Python_FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js_15_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

---

</div>

## 📌 Executive Summary

The **EL VERSE ECOSYSTEM** is a next-generation technology talent platform engineered to connect every stage of the tech career journey — **learning**, **interning**, **freelancing**, **building software**, and **community** — through five interconnected arms powered by a high-throughput **Go microservices backend**, **Python AI inference engine**, and **Supabase real-time database**.

### ⚡ The Problem & Solution
* **The Problem:** A developer spends 3+ hours daily switching between freelancing portals, job boards, learning platforms, social networks, and payment channels to find work, learn skills, and get paid.
* **The Solution:** One platform. Five arms. Single identity. Infinite possibilities.

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

| Arm | Primary Focus | Color Identity | Core Capabilities | Dedicated AI Agent |
| :--- | :--- | :--- | :--- | :--- |
| **ELITES** | Mentorship & Skill Building | `#8B5CF6` (Violet) | Per-stack Rank S to E progression, 3D IDE simulator, certificates, course catalog | **Menato** |
| **ELCODERS** | Enterprise Software Delivery | `#0066FF` (Blue) | Custom software scoping, product marketplace, tech matrix matching, client portal | **Elly** |
| **ELSPACE** | Freelance Marketplace | `#10B981` (Emerald) | Gig postings, proposal AI generation, milestone escrow, automated payouts | **Spectre** |
| **EL ACCESS** | Internship & Placement | `#F97316` (Orange) | Verified student applications, company dashboard, task tracking, placement matching | **Elly** |
| **NEXEL** | Social & Creator Hub | `#EC4899` (Pink) | Topic channels, real-time messaging, feed ranking, creator subscriptions | **Nelly** |

---

## 🤖 Specialized AI Agent Registry

| Agent | Arm Scope | Primary Responsibilities | Registered Tools | Human Approval |
| :--- | :--- | :--- | :--- | :---: |
| **Menato** | ELITES | Learning path creation, course search & enrollment | `search_courses`, `generate_learning_path`, `enroll_course` | Required for `enroll_course` |
| **Elly** | ELCODERS & EL ACCESS | Automated code reviews, project scoping, internship matching, ticket creation | `review_code`, `estimate_project`, `match_internship`, `create_support_ticket` | Required for `create_support_ticket` |
| **Spectre** | ELSPACE | Freelancer discovery, proposal drafting, project estimation | `find_freelancers`, `draft_proposal`, `estimate_project` | Automated |
| **Nelly** | NEXEL | Content moderation, feed ranking, thread summarization | `moderate_content`, `rank_feed`, `summarize_thread` | Automated |

---

## 🔒 Security & Hybrid ABAC/RBAC Access Control

The EL VERSE ECOSYSTEM enforces defense-in-depth authorization using a **hybrid RBAC + ABAC architecture**:

1. **RBAC (Role-Based Access Control):** Provides baseline structural permissions per user role (e.g., `platform.admin`, `elcoders.project.read`, `elites.course.publish`).
2. **ABAC (Attribute-Based Access Control):** Applies fine-grained, dynamic rules evaluating subject attributes (learner rank, client tier, MFA status), resource attributes (owner ID, sensitivity), action types, and environment variables (time windows, IP ranges).

```
┌──────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐     ┌──────────────────┐
│  Incoming User   │ ──▶ │      RBAC Check       │ ──▶ │      ABAC Check       │ ──▶ │ Security Decision│
│     Request      │     │ `has_permission(p)`   │     │ `abac_check(u,r,a)`   │     │  (ALLOW / DENY)  │
└──────────────────┘     └───────────────────────┘     └───────────────────────┘     └──────────────────┘
```

### 💳 Payment Webhook Verification Rules
* **Paystack Webhooks:** Validated using HMAC SHA-512 calculated over the raw request body with constant-time signature comparison (`hmac.Equal`).
* **Korapay Webhooks:** Validated using HMAC SHA-256 calculated over the `data` object within the JSON payload.

---

## 🏗️ Monorepo Architecture

```
elverse-ecosystem/
├── apps/
│   ├── web/                          # Next.js 15 App Router Web Applications
│   │   ├── elites-web/               # ELITES Learning Portal
│   │   ├── elcoders-web/             # ELCODERS Software Delivery Hub
│   │   ├── elspace-web/              # ELSPACE Freelance Marketplace
│   │   ├── elaccess-web/             # EL ACCESS Internship Portal
│   │   ├── nexel-web/                # NEXEL Social & Creator Web
│   │   ├── business-dashboard/       # Platform Command Center & KPI Analytics
│   │   ├── client-portal/            # Client Project & Deliverable Portal
│   │   ├── developer-dashboard/      # Developer Workspace & Time Tracking
│   │   ├── support-dashboard/        # Operations, Tickets & SLA Escalation
│   │   ├── crm/                      # Customer Relationship Management
│   │   ├── admin-panel/              # Platform Administration & Policy Editor
│   │   ├── ai-agent/                 # AI Agent Configuration & Monitoring
│   │   ├── onboarding-site/          # Ecosystem Onboarding & Auth
│   │   └── automation/               # Workflow Automation Tools
│   ├── mobile/                       # React Native / Expo Applications
│   │   ├── elites-mobile/            # ELITES Mobile Learning App
│   │   └── nexel-mobile/             # NEXEL Mobile Community App
│   ├── backend/                      # High-Performance Backend Services
│   │   ├── api-gateway/              # Fiber v3 API Gateway with JWT & Host Authorization
│   │   ├── auth-service/             # Supabase Auth Integration & Profile Management
│   │   ├── ai-service/               # Go Orchestrator for AI Agent Tools & SSE Relays
│   │   ├── ai-inference/             # Python FastAPI Inference & pgvector RAG
│   │   ├── payment-service/          # Korapay & Paystack Webhook Handler & Escrow
│   │   ├── messaging-service/        # Fiber WebSocket Engine with Channel Subscriptions
│   │   ├── notification-service/     # Multi-Channel Alert & Supabase Notification Hub
│   │   ├── course-service/           # ELITES Course Catalog & Progress Tracker
│   │   ├── job-service/              # ELSPACE Gigs & EL ACCESS Internships Engine
│   │   ├── marketplace-service/      # Digital Products & Ready-Made Solutions Catalog
│   │   ├── dispute-service/          # Contract Dispute & Escrow Resolution
│   │   ├── crm-service/              # Lead Scoring & Deal Pipeline
│   │   ├── analytics-service/        # KPI Aggregation & Materialized View Refresh
│   │   ├── consultation-service/     # Client Booking & Discovery Call System
│   │   └── automation-service/       # Workflow Triggers & Execution Engine
│   └── db/                           # Supabase Database & Migrations
│       ├── apply_schema.mjs          # Direct Schema Applier Script for Supabase/PostgreSQL
│       ├── migrations/               # Sequential SQL Migrations & RLS Security
│       └── tests/                    # SQL & RLS Security Test Suites
├── packages/                         # Shared Monorepo Workspaces
│   ├── shared-ui/                    # Design Tokens, CSS Tokens (`tokens.css`), UI Components
│   ├── shared-types/                 # Shared TypeScript Models & Role Taxonomies
│   ├── shared-supabase/              # Supabase SSR, Browser, Server, & Admin Client Helpers
│   ├── shared-hooks/                 # Shared React Hooks
│   ├── shared-api/                   # Shared API Clients & Fetchers
│   ├── shared-config/                # Zod Environment Validation
│   ├── shared-utils/                 # Helper Functions & Utilities
│   └── shared-db/                    # DB Client Wrappers
├── infrastructure/                   # Render Deployment Manifest (`render.yaml`) & Dockerfiles
└── docs/                             # OpenAPI Specs (`openapi.yaml`) & System Architecture
```

---

## 📋 Complete Feature & Logic Master List (~460 Feature Specifications)

### 1. Authentication & Identity
* **AUTH-001 Email + Password Signup:** Full name, email, password validation (min 8 chars, 1 upper, 1 lower, 1 digit, 1 symbol).
* **AUTH-002 Username Selection:** Unique, 3–30 chars, alphanumeric + underscore.
* **AUTH-003 Email Uniqueness:** Generic response to prevent enumeration attacks.
* **AUTH-004 Email Verification:** Link verification via Supabase Auth (24h expiry).
* **AUTH-009 Direct Link Auth:** No SMS or email OTP codes; authentication is strictly link-based.
* **AUTH-010 Disabled OAuth:** Third-party OAuth (Google, Apple, GitHub) explicitly disabled.
* **AUTH-020 Unified Login:** Single auth portal (`auth.elverse.com`) for all arms.
* **AUTH-024 Session Creation:** Access token (1h) + refresh token (7d).
* **AUTH-026 Session Limits:** Max 5 concurrent active sessions per user.

### 2. Unified Login & Real-Time Role Redirection
* **ROLE-001 Unified Portal:** `auth.elverse.com/login` routes users globally across all subdomains.
* **ROLE-010 Role Querying:** Fetches all active assignments from `rbac_user_roles`.
* **ROLE-020 Real-Time Role Updates:** Supabase Realtime DB triggers on `rbac_user_roles` broadcast to `user:{userId}`.
* **ROLE-022 Role Revocation:** Invalidates active user session and redirects to `/role-revoked`.
* **ROLE-026 Gateway Caching:** Go API Gateway subscribes to `rbac:updated` WebSocket channel to flush permission cache instantly.

### 3. ELITES — Mentorship & Learning Arm
* **ELITES-001 Course Catalog:** Paginated grid with stack, rank, and duration filters.
* **ELITES-003 Rank Gating:** Learners see and enroll only in courses at or below their rank per stack.
* **ELITES-021 Payments:** Integrated Korapay & Paystack checkout with instant enrollment webhook callback.
* **ELITES-046 3D IDE Simulator:** Monaco editor integration with real-time AI code review.
* **ELITES-060 Menato AI Mentor:** Streaming Socratic guidance, learning path generation, and course enrollment tool calls.
* **ELITES-100 Per-Stack Rank System:** Ranks E (Novice) to S (Elite) stored in `profiles.ranks` JSONB.

### 4. ELCODERS — Software Development Arm
* **ELCODERS-001 Services & Products:** Pre-packaged development services and 20+ ready-to-deploy products.
* **ELCODERS-004 Elly AI Scoping:** Estimates project hours, budget, and milestone timelines from requirement briefs.
* **ELCODERS-022 Developer Assignment:** Senior Developer assignment by Arm MD with Junior Developer delegation.
* **ELCODERS-028 Deliverable Management:** Git commit links, file attachments, and client approval tracking.
* **ELCODERS-057 AI Code Review:** Elly reviews code submissions prior to client review.

### 5. ELSPACE — Freelance Marketplace Arm
* **ELSPACE-001 Talent Directory:** Verified skill badges, portfolio displays, and hourly rates.
* **ELSPACE-004 Spectre AI Proposals:** Auto-drafts bids tailored to gig briefs.
* **ELSPACE-007 Milestone Escrow:** Platform holds funds in escrow until milestone deliverable approval.
* **ELSPACE-011 Payouts:** Automated bulk payouts via Korapay to bank accounts.
* **ELSPACE-050 Dispute Mediation:** Escalation workflow with private mediation channels.

### 6. EL ACCESS — Internship Placement Arm
* **ELACCESS-001 Internship Board:** Verified company internship listings with stipend tracking.
* **ELACCESS-002 Elly AI Matching:** Skill and rank-based candidate matching.
* **ELACCESS-007 Intern Dashboard:** Task completion logs, hours tracking, and mentor interaction.

### 7. NEXEL — Social Community & Content Arm
* **NEXEL-001 Nelly AI Feed:** Feed ranking by relevance, recency, and engagement metrics.
* **NEXEL-050 Topic Channels:** Public and private channels with verified account creation rights.
* **NEXEL-070 Messaging Engine:** Direct messages and group chats via private WebSocket channels.
* **NEXEL-090 Nelly AI Moderation:** Real-time auto-flagging of banned terms, spam, and threats.
* **NEXEL-110 Creator Subscriptions:** Tiered monthly memberships with recurring payments.

### 8. Dashboards & System Operations
* **Business Dashboard:** Executive command center displaying real-time platform KPIs, MRR/ARR, and service health.
* **Support Dashboard:** Ticket queue with SLA gauges, priority filters, and automated breach escalations.
* **Admin Panel:** Global user management, RBAC/ABAC policy editor, impersonation audit, and feature flag toggles.
* **CRM System:** Lead scoring, deal pipeline tracking, and contact history.
* **Automation Builder:** Drag-and-drop workflow canvas (React Flow) supporting scheduled triggers, AI prompts, and HTTP webhooks.

---

## 🛠️ Quick Start & Local Development

### Prerequisites
* **Node.js:** `>= 20.x`
* **pnpm:** `>= 9.x`
* **Go:** `>= 1.23`
* **Python:** `>= 3.11`

### 1. Repository Setup & Dependencies
```bash
git clone https://github.com/EL-VERSE-ECOSYSTEM/EL-VERSE-ECOSYSTEM.git
cd EL-VERSE-ECOSYSTEM
pnpm install
```

### 2. Apply Database Schema Migrations to Supabase
```bash
# Set your Supabase / PostgreSQL Connection String
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Execute all sequential migrations in apps/db/migrations/
node apps/db/apply_schema.mjs
```

### 3. Execute Service Test Suites
```bash
# Run tests for all Go microservices in apps/backend/
for dir in apps/backend/*/; do
  if [ -f "${dir}go.mod" ]; then
    echo "Testing $dir..."
    (cd "$dir" && go test ./...)
  fi
done
```

### 4. Launch Development Environment
```bash
pnpm dev
```

---

## ⚡ Deployment Configuration

All services and databases are configured for automatic deployment on **Render** and **Vercel** via `infrastructure/render.yaml`:

```yaml
services:
  - type: web
    name: elverse-api-gateway
    env: go
    buildCommand: cd apps/backend/api-gateway && go build -o app cmd/main.go
    startCommand: ./apps/backend/api-gateway/app
    envVars:
      - key: PORT
        value: 10000
```

---

## 📜 License

This repository is proprietary software licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

<div align="center">
  <sub>Built with ❤️ by the EL VERSE ECOSYSTEM Core Engineering Team.</sub>
</div>
