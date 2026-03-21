# Shramik Setu MVP: Next.js + Firebase Implementation Plan

## Goal Description
The objective is to architect and plan the **Shramik Setu MVP** using **Next.js** for the frontend (and API layer) and **Firebase** as the complete backend ecosystem. This replaces the originally proposed PostgreSQL, Supabase, and Node.js backend to provide a more streamlined, real-time, and offline-capable architecture suitable for rapid MVP development.

## Core Technology Enhancements
1. **Frontend**: Next.js 14 (App Router) with Tailwind CSS.
2. **Backend Services (Firebase)**:
   - **Authentication**: Phone Authentication & OTP (critical for the target demographic).
   - **Database**: Cloud Firestore (NoSQL document store with built-in offline persistence).
   - **Storage**: Firebase Storage (for profile photos, document scans).
   - **Hosting**: Firebase Hosting (optimized for Next.js).
   - **Serverless Compute**: Next.js API Routes (Server Actions) or Firebase Cloud Functions for heavy logic (Wage Fairness, Job Matching algorithms).

---

## Proposed Database Schema (Firestore Collections)

Firestore is a NoSQL database, so we design collections based on the read/write patterns:

### 1. `users` (Collection)
Stores both Labourers and Employers to simplify Authentication, differentiated by a `role` field.
- `uid` (String, Document ID)
- `phoneNumber` (String)
- `role` (String: "labourer" | "employer")
- `createdAt` (Timestamp)
- `name` (String)
- **Labourer Specific**: `skills` (Array of Strings), `languages` (Array), `location` (GeoPoint / Geohash for queries), `mockAadhaar` (String), `rating` (Number), `completedJobs` (Number)
- **Employer Specific**: `businessName` (String), `trustScore` (Number)

### 2. `jobs` (Collection)
Stores all posted jobs.
- `jobId` (String, Document ID)
- `employerId` (String, Reference to users)
- `title` (String), `description` (String)
- `skillsRequired` (Array of Strings)
- `location` (GeoPoint / Geohash for queries), `address` (String)
- `wageOffered` (Number), `durationDays` (Number)
- `status` (String: "open" | "in_progress" | "completed" | "cancelled")
- `wageFairnessStatus` (String: "verified" | "flagged")
- `createdAt` (Timestamp)

### 3. `job_applications` / `matches` (Collection)
Tracks worker interests and employer hires.
- `jobId` (String, Reference)
- `workerId` (String, Reference)
- `status` (String: "matched" | "accepted" | "hired" | "rejected")
- `createdAt` (Timestamp)

### 4. `schemes` (Collection)
Static collection (rarely updated) populated with government scheme criteria for the Auto-Matcher.
- `schemeName` (String), `description` (String), `applyLink` (String)
- `eligibilityCriteria` (Map: `{ minAge: 18, maxIncome: 15000, roles: ["construction"] }`)

---

## Feature Implementation Strategy

### 1. Authentication & Digital Labour Card
- **Auth Flow**: Users register/login using Firebase Phone Auth. After OTP verification, they complete their profile (mock Aadhaar details, skills).
- **The Card**: React component rendering user data fetched from Firestore. Next.js generates a static QR code using an NPM library (`qrcode.react`), which encodes the user's public profile URL.
- **Offline Access**: Firestore's SDK intrinsically supports caching. The Digital Labour Card will load from the local cache instantly even without the internet.

### 2. Wage Fairness Engine
- **Implementation**: Instead of Python, run this logic server-side inside a **Next.js Server Action** or API Route when an employer submits a job posting.
- **Workflow**:
  1. Employer submits job form (skill: mason, state: Gujarat, wage: ₹250).
  2. Next.js Server Action fetches the minimum wage for "mason" in "Gujarat" (hardcoded JSON map or separate Firestore doc for the MVP).
  3. Validates wage. If below minimum, returns a warning to the frontend.
  4. If acknowledged, saves job to Firestore with `wageFairnessStatus: 'flagged'`.

### 3. Job Matching Engine
- **Geolocation with Firestore**: Firestore natively supports GeoPoints but limited radius queries. For MVP matching:
  - Generate a `geohash` for every job and user.
  - Query Firestore for jobs with a similar `geohash` prefix (representing nearby areas) AND matching `skillsRequired` against the worker's `skills` array.
- **Notification**: Use Firebase Cloud Messaging (FCM) or Twilio SMS webhook connected to a Next.js API route to alert the worker when a matching job is created.

### 4. Government Scheme Auto-Matcher
- **Implementation**: Client-side or Server-side evaluation.
- **Workflow**: When the worker views the "Schemes" tab, fetch the `schemes` collection.
- Run a simple rule-engine filtering function on the user's local device (or via Server Action) that compares the user's profile attributes (age, location, job type) against the scheme's `eligibilityCriteria`.

### 5. Offline-First Architecture (PWA)
- **Next.js PWA**: Wrap the Next.js app with `next-pwa` to generate the Service Worker and Web App Manifest.
- **Firestore Persistence**: Enable `enableIndexedDbPersistence()` in the Firebase client initialization. This ensures all previously fetched jobs, profile data, and schemes are available offline.
- **Optimistic UI**: When accepting a job offline, Firestore queues the write and automatically syncs it when the device regains connection.

---

## MVP Development Steps (Hackathon Execution)

1. **Setup & Config**: Initialize Next.js, configure Tailwind, setup Firebase console, and integrate Firebase SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`).
2. **Auth & Profile Creation**: Build Phone Auth screens, user role selection (Worker/Employer), and profile data forms. Write to `users` collection.
3. **Digital Labour Card UI**: Clean Tailwind component displaying user details and QR Code.
4. **Employer Flow**: Build the job posting form with the integrated Server Action for the Wage Fairness Check.
5. **Feed & Matching**: Build the worker dashboard querying the `jobs` collection based on matching skills and simple location filtering.
6. **Welfare Tab**: Build the scheme auto-matcher view comparing local profile state with fetched schemes.
7. **PWA Polish**: Configure `next-pwa`, test offline capabilities using Chrome DevTools.

## Verification
- Test Phone Auth (using test numbers in Firebase Console).
- Verify Offline capabilities by turning off network and reloading. Profile should load instantly.
- Test job posting with wages below minimum wage to trigger the Wage Fairness warning.
- Ensure geolocation queries filter out jobs in entirely different cities.
