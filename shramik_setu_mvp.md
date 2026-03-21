# Shramik Setu — MVP Documentation
### *A civic platform formalizing India's unorganized workforce*

---

## Problem Statement

**CivicTech Track — Workforce & Social Welfare**

India has 500 million unorganized workers — farmers, construction labourers, daily wage workers — who face three compounding problems:

1. **No portable identity.** A worker's skills and work history exist only in word-of-mouth. Each new employer starts from zero trust.
2. **Wage exploitation.** Without knowledge of minimum wage laws or any enforcement mechanism, workers routinely accept below-legal wages.
3. **Invisible to welfare.** Government schemes like e-Shram, BOCW, PMAY, and hundreds of state scholarships go unclaimed because workers don't know they exist or can't navigate the portals.

Meanwhile, farmers and contractors urgently need labour — especially during harvest season — but have no reliable way to find verified, skilled workers nearby.

> **The gap isn't supply or demand. It's the absence of trusted civic infrastructure connecting them.**

---

## Solution

**Shramik Setu** (Hindi: *Bridge for Workers*) is not a job board.

It is a **digital identity and welfare access system** for India's unorganized workforce, built on top of existing government infrastructure (Aadhaar, e-Shram, BOCW, NIC). The job matching feature is the delivery mechanism — the civic value is the layer underneath it.

### One-line pitch
> *"Give every Indian labourer a portable digital identity, protect their wages by law, and automatically connect them to every government benefit they've been missing."*

---

## Core Features — MVP

### 1. Digital Labour Card

The foundational feature. Every registered worker gets a portable, Aadhaar-verified digital card.

**What it contains:**
- Full name, photo, Aadhaar-linked ID
- Skills list (mason, welder, harvester, plumber, etc.)
- District and languages spoken
- Work history — each completed job is appended with employer name, duration, wage, and rating
- QR code — employers scan to instantly verify identity and history

**Why it's civic infrastructure:**
The card is *owned by the worker*, not the platform. It travels with them across jobs, states, and employers. It cannot be taken away or denied. Over time it becomes a financial identity document that can support credit, insurance, and formal employment.

**Tech:** Next.js PWA · Supabase Auth · QR code generation · Aadhaar e-KYC (mocked for hackathon, real integration via DigiLocker API post-launch)

---

### 2. Job Matching Engine

Employers post requirements; the system surfaces the best-matched workers nearby.

**Employer posts:**
- Job type, skill required, location (map pin or village name)
- Duration (one day / one week / full project)
- Wage offered (daily rate)

**System does:**
- Ranks nearby workers by: skill match → distance → rating → availability
- Runs the **Wage Fairness Check** (see below) before the job goes live
- Notifies matched workers via app push notification AND SMS

**Worker receives:**
- Job details, employer name, distance, wage
- One-tap accept (app) or SMS reply "ACCEPT" (feature phone)

**Offline / SMS mode:**
A worker with no smartphone can text `JOBS SURAT MASON` to a Twilio number and receive the top 3 matches as a plain SMS reply.

**Tech:** PostGIS for geolocation ranking · Node.js matching algorithm · Twilio SMS · Firebase offline queue

---

### 3. Wage Fairness Engine

Every job posted on the platform is automatically checked against the current state minimum wage schedule.

**How it works:**
- Minimum wage database maintained per state, per skill category, per year (scraped from Labour Ministry)
- When employer enters a wage, system compares against legal minimum for that job type in that state
- If below minimum: employer sees a warning, must explicitly acknowledge before proceeding
- Warning is logged — repeated violations flag the employer's public profile
- Workers see a badge: ✓ *Wage verified — meets minimum wage* or ⚠ *Below legal minimum*

**Why this matters:**
This is enforceable civic infrastructure. It doesn't prevent low offers but it creates a transparent, logged record — which is exactly what labour enforcement agencies need.

**Tech:** Python wage comparison engine · State minimum wage dataset (public, updated quarterly) · PostgreSQL

---

### 4. Government Scheme Auto-Matcher

The worker's profile is automatically matched against every relevant government scheme at registration and updated when their profile changes.

**Schemes matched (examples):**
| Scheme | Who qualifies |
|--------|--------------|
| e-Shram | Any unorganized worker, 16–59 years |
| BOCW (Building & Construction Workers) | Construction workers in any state |
| PMAY (Pradhan Mantri Awas Yojana) | Low-income households without pucca house |
| PM-SYM (Pension) | Workers aged 18–40, income < ₹15,000/month |
| NSP Scholarships | Children of workers below income threshold |
| State-specific schemes | Varies by state, auto-detected by district |

**Output for worker:**
- Plain-language summary: *"You qualify for 4 schemes. The most important one is e-Shram — it gives you ₹2 lakh accident insurance for free."*
- Shown in worker's preferred language (Hindi, Gujarati, Tamil, Bengali, etc.)
- One-click deep-link to official government application portal
- Offline-cached so readable without internet

**Children's section:**
If worker has children, a dedicated section shows scholarships (NSP, state boards, minority scholarships) based on the parent's income and state — with eligibility explained simply and application links provided.

**Tech:** Rule-based eligibility engine (Python) · IndicNLP for regional language text · Google Translate API · Offline caching via Workbox

---

### 5. Offline-First Architecture

The platform is designed from day one for low-connectivity rural India.

**PWA with service worker:**
- Full profile, matched jobs, and scheme info readable offline
- Actions taken offline (job accept, profile update) are queued and synced on reconnect
- Works on low-end Android phones with 1–2 GB RAM

**SMS fallback commands:**

| Command | Response |
|---------|----------|
| `JOBS [district] [skill]` | Top 3 job matches |
| `CARD` | Digital card link via SMS |
| `SCHEMES` | Top 3 matched schemes |
| `STATUS [job_id]` | Current job status |
| `HELP` | List of all commands |

**Tech:** Next.js PWA · Workbox service worker · Firebase local persistence · Twilio SMS webhook

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router) — web + PWA
- **Tailwind CSS** — responsive UI


### Backend
- **Node.js + Express** — REST API
- **Python** — NLP, scheme matching, wage engine

### Database
- **PostgreSQL + PostGIS** — worker profiles, jobs, geolocation queries
- **Supabase** — auth, real-time, storage
- **Firebase** — offline sync, push notifications

### Integrations
- **Aadhaar e-KYC / DigiLocker API** — identity verification
- **Twilio** — SMS notifications and commands
- **Google Maps / Mapbox** — location, job radius
- **Google Translate API** — multilingual content
- **IndicNLP** — Indian language text processing
- **Labour Ministry API / scraped data** — minimum wage database
- **e-Shram API** — scheme registration deep-link
- **NIC APIs** — government scheme data

---

## Architecture Overview

```
Users
  ├── Labourer (app / SMS / PWA)
  ├── Employer (web / app)
  └── Government (admin dashboard)
          │
          ▼
Core Platform (Next.js + Node.js API)
  ├── Auth & Aadhaar verification
  ├── Job matching engine (PostGIS + ranking)
  ├── Wage fairness engine (Python)
  ├── Offline sync (Workbox + Firebase)
  └── Multilingual NLP (IndicNLP)
          │
          ▼
Feature Modules
  ├── Digital Labour Card
  ├── Scheme Auto-Matcher
  ├── Grievance Filing
  └── Employer Trust & Ratings
          │
          ▼
Infrastructure
  PostgreSQL · Supabase · Firebase · Twilio · Maps API
          │
          ▼
Government Integrations
  e-Shram · BOCW · PMAY · NSP · Labour Dept Grievance API
```

---

## User Flows

### Labourer Journey
1. Register → Aadhaar verify → build profile (skills, district, language)
2. Receive Digital Labour Card (QR code)
3. Get job match notification (app or SMS)
4. Accept job → complete work → receive rating
5. Work history auto-updated on card
6. View matched government schemes in native language
7. File grievance if wage unpaid or conditions unsafe

### Employer Journey
1. Register (farm / construction business / contractor)
2. Post job: skill needed, location, duration, wage
3. Wage Fairness Check runs automatically
4. View ranked, verified worker list
5. Scan worker's QR code to verify identity
6. Hire → digital work agreement logged
7. Rate worker after completion

---

## MVP Scope — Hackathon (24–36 hours)

### Must Have (demo-ready)
- [ ] Worker registration + Aadhaar mock verification
- [ ] Digital Labour Card generation with QR code
- [ ] Employer job posting form
- [ ] Wage Fairness Check (flags below-minimum wages)
- [ ] Worker matching by skill + geolocation
- [ ] SMS notification via Twilio
- [ ] Scheme auto-matcher (3–5 major schemes)
- [ ] Multilingual output (Hindi + 1 regional language)
- [ ] Offline PWA (read mode)

### Should Have (v1 launch)
- [ ] Grievance filing → routes to district labour office
- [ ] Employer ratings and trust flags
- [ ] Full SMS command interface
- [ ] All 28 states' minimum wage data
- [ ] Children's scholarship section

### Nice to Have (v2)
- [ ] Government analytics dashboard
- [ ] Voice-based interface (IVR) for non-literate users
- [ ] Integration with PM-KISAN for farmer-employers
- [ ] Credit score based on work history (fintech partnership)

---

## Hackathon Demo Script (2 minutes)

1. **Open app as labourer** → register with Aadhaar → profile shows Digital Labour Card with QR
2. **Scheme matcher fires** → "You qualify for e-Shram (₹2L insurance) and BOCW. Apply now." — shown in Hindi
3. **Switch to employer view** → post harvest job in Surat, ₹250/day for mason
4. **Wage engine flags** → "Below Gujarat minimum wage (₹317/day). Please correct." → employer updates to ₹320
5. **Worker receives SMS** → "New job: 3km away, ₹320/day, 5 days. Reply ACCEPT"
6. **Worker accepts** → job logged → work history updated on card

> *This demo covers: civic identity, wage protection, welfare access, and offline reach — all in 2 minutes.*

---

## Why This Wins CivicTech

| Criterion | How Shramik Setu delivers |
|-----------|--------------------------|
| Solves a real civic problem | 500M unorganized workers with no formal identity or welfare access |
| Not a complaint form or FAQ bot | Deep government integration, enforcement mechanism, portable ID |
| Works offline / low connectivity | PWA + SMS fallback designed from day one |
| Scalable | Aadhaar + government APIs = nationwide from day one |
| Government collaboration path | e-Shram, BOCW, DigiLocker integrations are real and live |
| Measurable impact | Wage compliance rate, scheme uptake, employment days logged |

---

## Team Pitch Framing

> *"Growing up near farms, we saw the same problem every harvest season — workers available, employers desperate, yet both disconnected. We initially thought: build Uber for labour. But the deeper problem isn't discovery. It's the complete absence of formal identity, wage protection, and welfare access for India's largest workforce. So we built the civic infrastructure layer that should have existed — and put the job matching on top of it."*

---

*Built for [Hackathon Name] · CivicTech Track · 2025*
