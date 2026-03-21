// Translations for the Shramik Setu MVP
// Supports English (en) and Hindi (hi)

export type Language = "en" | "hi";

type TranslationMap = {
  [key: string]: { en: string; hi: string };
};

export const translations: TranslationMap = {
  // App-level
  app_name: { en: "Shramik Setu", hi: "श्रमिक सेतु" },
  app_tagline: { en: "Your Digital Civic Identity", hi: "आपकी डिजिटल नागरिक पहचान" },

  // Navigation
  nav_home: { en: "Home", hi: "होम" },
  nav_card: { en: "Card", hi: "कार्ड" },
  nav_jobs: { en: "Jobs", hi: "नौकरी" },
  nav_schemes: { en: "Schemes", hi: "योजनाएं" },
  nav_profile: { en: "Profile", hi: "प्रोफ़ाइल" },

  // Dashboard
  matched_jobs: { en: "Matched Jobs", hi: "मिलती जुलती नौकरियां" },
  government_benefits: { en: "Government Benefits", hi: "सरकारी लाभ" },
  view_all: { en: "View All", hi: "सभी देखें" },
  accept_job: { en: "Accept Job", hi: "नौकरी स्वीकार करें" },
  review_details: { en: "Review Details", hi: "विवरण देखें" },
  accepted: { en: "Accepted", hi: "स्वीकृत" },
  eligible: { en: "Eligible", hi: "पात्र" },
  apply: { en: "Apply", hi: "आवेदन करें" },
  km_away: { en: "km away", hi: "किमी दूर" },
  days_req: { en: "Days req.", hi: "दिन आवश्यक" },
  per_day: { en: "/ day", hi: "/ दिन" },
  match: { en: "Match", hi: "मैच" },

  // Digital Card
  digital_labour_card: { en: "Digital Labour Card", hi: "डिजिटल श्रमिक कार्ड" },
  portable_identity: { en: "Your portable worker identity", hi: "आपकी पोर्टेबल कामगार पहचान" },
  verified_identity: { en: "Verified Identity", hi: "सत्यापित पहचान" },
  aadhaar_linked: { en: "Aadhaar Linked", hi: "आधार जुड़ा हुआ" },
  role: { en: "Role", hi: "भूमिका" },
  location: { en: "Location", hi: "स्थान" },
  rating: { en: "Rating", hi: "रेटिंग" },
  member_since: { en: "Member Since", hi: "सदस्य तिथि" },
  skills: { en: "Skills", hi: "कौशल" },
  languages: { en: "Languages", hi: "भाषाएं" },
  work_history: { en: "Work History", hi: "कार्य इतिहास" },
  share: { en: "Share", hi: "शेयर करें" },
  phone: { en: "Phone", hi: "फ़ोन" },

  // Schemes
  government_schemes: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
  eligible_schemes: { en: "Eligible Schemes", hi: "पात्र योजनाएं" },
  not_eligible: { en: "Not Eligible", hi: "अपात्र" },
  you_are_eligible: { en: "You Are Eligible", hi: "आप पात्र हैं" },
  apply_now: { en: "Apply Now", hi: "अभी आवेदन करें" },
  requires_aadhaar: { en: "Requires Aadhaar", hi: "आधार आवश्यक" },
  schemes_subtitle: { en: "Find and apply for benefits you are eligible for.", hi: "अपने लिए उपलब्ध लाभ खोजें और आवेदन करें।" },

  // Employer
  employer_dashboard: { en: "Employer Dashboard", hi: "नियोक्ता डैशबोर्ड" },
  post_job: { en: "Post a New Job", hi: "नई नौकरी पोस्ट करें" },
  find_workers: { en: "Find verified workers nearby", hi: "पास के सत्यापित कामगार खोजें" },
  jobs_posted: { en: "Jobs Posted", hi: "पोस्ट की गई नौकरियां" },
  workers_hired: { en: "Workers Hired", hi: "काम पर रखे गए कामगार" },
  trust_score: { en: "Trust Score", hi: "भरोसा स्कोर" },
  wage_flags: { en: "Wage Flags", hi: "वेतन चेतावनी" },
  recent_postings: { en: "Your Recent Postings", hi: "आपकी हालिया पोस्टिंग" },

  // Wage Fairness
  wage_fairness_check: { en: "Wage & Fairness Check", hi: "वेतन और न्यायता जांच" },
  daily_wage: { en: "Daily Wage", hi: "दैनिक मजदूरी" },
  wage_verified: { en: "Wage verified — meets state minimum wage", hi: "वेतन सत्यापित — राज्य न्यूनतम वेतन पूरा करता है" },
  wage_below: { en: "Warning: Below legal minimum wage", hi: "चेतावनी: कानूनी न्यूनतम वेतन से कम" },

  // Registration
  choose_role: { en: "Choose your role to get started", hi: "शुरू करने के लिए अपनी भूमिका चुनें" },
  worker_labourer: { en: "Worker / Labourer", hi: "कामगार / मजदूर" },
  employer_contractor: { en: "Employer / Contractor", hi: "नियोक्ता / ठेकेदार" },
  complete_registration: { en: "Complete Registration", hi: "पंजीकरण पूरा करें" },

  // Profile
  jobs_done: { en: "Jobs Done", hi: "पूरी नौकरियां" },
  personal_info: { en: "Personal Information", hi: "व्यक्तिगत जानकारी" },

  // Job Details
  employer_label: { en: "Employer", hi: "नियोक्ता" },
  duration: { en: "Duration", hi: "अवधि" },
  payment: { en: "Payment", hi: "भुगतान" },
  start_date: { en: "Start Date", hi: "शुरू की तारीख" },
  job_description: { en: "Job Description", hi: "नौकरी का विवरण" },
  skills_required: { en: "Skills Required", hi: "आवश्यक कौशल" },
  accept_job_offer: { en: "Accept Job Offer", hi: "नौकरी प्रस्ताव स्वीकार करें" },
  job_accepted: { en: "Job Accepted — You will be notified", hi: "नौकरी स्वीकृत — आपको सूचित किया जाएगा" },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}
