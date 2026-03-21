// seed.js
// Run this script via Node to populate your Firestore database.
// Usage: node seed.js
// Make sure you have downloaded your Firebase Service Account JSON file!

const admin = require("firebase-admin");

// 1. Point this to your downloaded service account key from Firebase Console
// Go to Project Settings -> Service Accounts -> Generate New Private Key
const serviceAccount = require("./serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ----------------------------------------------------------------------
// DATA PAYLOADS (Matches src/lib/mockData.ts)
// ----------------------------------------------------------------------

const workers = [
  {
    uid: "worker-1001",
    name: "Raju Kumar",
    role: "Mason",
    location: "Surat, GJ",
    rating: 4.8,
    jobsCompleted: 24,
    isAadhaarVerified: true,
    skills: ["Masonry", "Cement Work"],
    languages: ["Hindi", "Gujarati"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

const jobs = [
  {
    id: "job-1",
    employerId: "employer-9001",
    title: "Residential Mason",
    company: "Shreeji Constructions",
    distanceKm: 3.5,
    durationDays: 5,
    wagePerDay: 850,
    matchScore: 80,
    status: "open",
    wageFairnessStatus: "verified",
    location: new admin.firestore.GeoPoint(21.1702, 72.8311), // Surat
    skillsRequired: ["Masonry"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "job-2",
    employerId: "employer-9002",
    title: "Block Layer",
    company: "Patel Farm Exp.",
    distanceKm: 8.2,
    durationDays: 2,
    wagePerDay: 700,
    matchScore: 65,
    status: "open",
    wageFairnessStatus: "verified",
    location: new admin.firestore.GeoPoint(21.1750, 72.8350), 
    skillsRequired: ["Masonry"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "job-3",
    employerId: "employer-9003",
    title: "Senior Plastering Mason",
    company: "L&T Sites",
    distanceKm: 12.0,
    durationDays: 30,
    wagePerDay: 950,
    matchScore: 88,
    status: "open",
    wageFairnessStatus: "verified",
    location: new admin.firestore.GeoPoint(21.1800, 72.8400),
    skillsRequired: ["Masonry", "Plastering"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

const schemes = [
  {
    id: "scheme-1",
    title: "e-Shram Portal",
    benefit: "₹2 Lakh Accidental Insurance Cover",
    description: "National database of unorganized workers providing social security benefits.",
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 59,
      isIncomeTaxPayee: false
    },
    applyLink: "https://eshram.gov.in"
  },
  {
    id: "scheme-2",
    title: "BOCW Card",
    benefit: "Tool Purchase Grant ₹5000",
    description: "Building and Other Construction Workers Welfare Board scheme.",
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 60,
      mustBeConstructionWorker: true,
      minDaysWorkedPrecedingYear: 90
    },
    applyLink: "#"
  }
];

// ----------------------------------------------------------------------
// SEEDING LOGIC
// ----------------------------------------------------------------------

async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    // 1. Seed Users (Workers & Employers)
    console.log("Seeding Users Collection...");
    const usersRef = db.collection("users");
    for (const worker of workers) {
      await usersRef.doc(worker.uid).set(worker);
      console.log(`Added user: ${worker.name}`);
    }

    // 2. Seed Jobs
    console.log("\nSeeding Jobs Collection...");
    const jobsRef = db.collection("jobs");
    for (const job of jobs) {
      // Create document with specific ID to match our mock data
      await jobsRef.doc(job.id).set(job);
      console.log(`Added job: ${job.title}`);
    }

    // 3. Seed Schemes
    console.log("\nSeeding Schemes Collection...");
    const schemesRef = db.collection("schemes");
    for (const scheme of schemes) {
      await schemesRef.doc(scheme.id).set(scheme);
      console.log(`Added scheme: ${scheme.title}`);
    }

    console.log("\n✅ Seeding Complete!");
  } catch (error) {
    console.error("❌ Error seeding database: ", error);
  } finally {
    // Clean up connections
    process.exit(0);
  }
}

seedDatabase();
