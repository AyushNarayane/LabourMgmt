// =============================================
// TYPES
// =============================================

export type WorkerProfile = {
  id: string;
  name: string;
  role: string;
  location: string;
  district: string;
  state: string;
  rating: number;
  jobsCompleted: number;
  isAadhaarVerified: boolean;
  aadhaarLast4: string;
  skills: string[];
  languages: string[];
  phone: string;
  createdAt: string;
  workHistory: WorkHistoryEntry[];
  // Optional real Aadhaar fields (populated after KYC verification)
  dob?: string;
  gender?: string;
  careOf?: string;
  photo?: string;
  address?: {
    house?: string;
    street?: string;
    locality?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
};

export type WorkHistoryEntry = {
  jobTitle: string;
  company: string;
  durationDays: number;
  wagePerDay: number;
  rating: number;
  completedDate: string;
};

export type Job = {
  id: string;
  employerId: string;
  title: string;
  company: string;
  description: string;
  distanceKm: number;
  durationDays: number;
  wagePerDay: number;
  matchScore: number;
  status: "open" | "accepted" | "in_progress" | "completed";
  wageFairnessStatus: "verified" | "flagged";
  skillsRequired: string[];
  location: string;
  startDate: string;
};

export type Employer = {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  location: string;
  state: string;
  trustScore: number;
  jobsPosted: number;
  wageViolations: number;
};

export type GovernmentScheme = {
  id: string;
  title: string;
  benefit: string;
  description: string;
  applyLink: string;
  isEligible: boolean;
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    roles?: string[];
    states?: string[];
    maxIncome?: number;
  };
};

export type MinimumWage = {
  state: string;
  skill: string;
  dailyWage: number;
  effectiveYear: number;
};

// =============================================
// SKILL OPTIONS
// =============================================
export const SKILL_OPTIONS = [
  "Mason", "Welder", "Harvester", "Plumber", "Carpenter",
  "Electrician", "Painter", "Tile Worker", "Concrete Mixer",
  "Iron Bender", "Scaffolder", "Driver", "Helper"
];

export const LANGUAGE_OPTIONS = [
  "Hindi", "Gujarati", "Tamil", "Bengali", "Telugu",
  "Marathi", "Kannada", "Malayalam", "Odia", "Punjabi"
];

export const STATE_OPTIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Dibang Valley", "Dibang Valley", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  "Nagaland": ["Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyü", "Tuensang", "Wokha", "Zünheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Sri Muktsar Sahib", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Agatti", "Amini", "Androth", "Bithra", "Chetlat", "Kadmat", "Kalpeni", "Kavaratti", "Kiltan", "Minicoy"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

// =============================================
// MINIMUM WAGES DATABASE (per state per skill)
// =============================================
export const minimumWages: MinimumWage[] = [
  { state: "Gujarat", skill: "Mason", dailyWage: 317, effectiveYear: 2024 },
  { state: "Gujarat", skill: "Welder", dailyWage: 340, effectiveYear: 2024 },
  { state: "Gujarat", skill: "Plumber", dailyWage: 310, effectiveYear: 2024 },
  { state: "Gujarat", skill: "Carpenter", dailyWage: 325, effectiveYear: 2024 },
  { state: "Gujarat", skill: "Helper", dailyWage: 275, effectiveYear: 2024 },
  { state: "Gujarat", skill: "Painter", dailyWage: 300, effectiveYear: 2024 },
  { state: "Gujarat", skill: "Electrician", dailyWage: 350, effectiveYear: 2024 },
  { state: "Maharashtra", skill: "Mason", dailyWage: 380, effectiveYear: 2024 },
  { state: "Maharashtra", skill: "Welder", dailyWage: 390, effectiveYear: 2024 },
  { state: "Maharashtra", skill: "Plumber", dailyWage: 370, effectiveYear: 2024 },
  { state: "Maharashtra", skill: "Helper", dailyWage: 300, effectiveYear: 2024 },
  { state: "Rajasthan", skill: "Mason", dailyWage: 290, effectiveYear: 2024 },
  { state: "Rajasthan", skill: "Helper", dailyWage: 250, effectiveYear: 2024 },
  { state: "Tamil Nadu", skill: "Mason", dailyWage: 410, effectiveYear: 2024 },
  { state: "Tamil Nadu", skill: "Helper", dailyWage: 310, effectiveYear: 2024 },
  { state: "Karnataka", skill: "Mason", dailyWage: 380, effectiveYear: 2024 },
  { state: "Karnataka", skill: "Helper", dailyWage: 290, effectiveYear: 2024 },
];

// =============================================
// MOCK DATA
// =============================================

export const mockWorker: WorkerProfile = {
  id: "worker-1001",
  name: "Raju Kumar",
  role: "Mason",
  location: "Surat, GJ",
  district: "Surat",
  state: "Gujarat",
  rating: 4.8,
  jobsCompleted: 24,
  isAadhaarVerified: true,
  aadhaarLast4: "7834",
  skills: ["Mason", "Painter"],
  languages: ["Hindi", "Gujarati"],
  phone: "+91 98765 43210",
  createdAt: "2024-11-15",
  workHistory: [
    { jobTitle: "Residential Mason", company: "Shreeji Constructions", durationDays: 5, wagePerDay: 850, rating: 5, completedDate: "2025-03-10" },
    { jobTitle: "Plastering Work", company: "L&T Sites", durationDays: 15, wagePerDay: 920, rating: 4.5, completedDate: "2025-02-20" },
    { jobTitle: "Wall Builder", company: "Modi Infra", durationDays: 8, wagePerDay: 800, rating: 4.8, completedDate: "2025-01-12" },
  ]
};

export const mockEmployer: Employer = {
  id: "employer-9001",
  businessName: "Shreeji Constructions",
  contactPerson: "Amit Patel",
  phone: "+91 99887 66554",
  location: "Surat, GJ",
  state: "Gujarat",
  trustScore: 4.5,
  jobsPosted: 12,
  wageViolations: 0,
};

export const mockJobs: Job[] = [
  {
    id: "job-1",
    employerId: "employer-9001",
    title: "Residential Mason",
    company: "Shreeji Constructions",
    description: "Looking for an experienced mason for residential building construction work. Valid Aadhaar and safety shoes required on site.",
    distanceKm: 3.5,
    durationDays: 5,
    wagePerDay: 850,
    matchScore: 80,
    status: "open",
    wageFairnessStatus: "verified",
    skillsRequired: ["Mason"],
    location: "Adajan, Surat",
    startDate: "2025-03-25",
  },
  {
    id: "job-2",
    employerId: "employer-9002",
    title: "Block Layer",
    company: "Patel Farm Exp.",
    description: "Farm boundary wall block laying work. Need skilled block layer for 2 day assignment.",
    distanceKm: 8.2,
    durationDays: 2,
    wagePerDay: 700,
    matchScore: 65,
    status: "open",
    wageFairnessStatus: "verified",
    skillsRequired: ["Mason"],
    location: "Kamrej, Surat",
    startDate: "2025-03-28",
  },
  {
    id: "job-3",
    employerId: "employer-9003",
    title: "Senior Plastering Mason",
    company: "L&T Sites",
    description: "Large scale commercial plastering project. Experienced plaster masons preferred, 30 day project with daily payment.",
    distanceKm: 12.0,
    durationDays: 30,
    wagePerDay: 950,
    matchScore: 88,
    status: "open",
    wageFairnessStatus: "verified",
    skillsRequired: ["Mason", "Painter"],
    location: "Hazira, Surat",
    startDate: "2025-04-01",
  },
];

export const mockSchemes: GovernmentScheme[] = [
  {
    id: "scheme-1",
    title: "e-Shram Portal",
    benefit: "₹2 Lakh Accidental Insurance Cover",
    description: "National database of unorganized workers providing social security benefits including accidental insurance of ₹2 Lakh and ₹1 Lakh for partial disability.",
    applyLink: "https://eshram.gov.in",
    isEligible: true,
    eligibilityCriteria: { minAge: 16, maxAge: 59 },
  },
  {
    id: "scheme-2",
    title: "BOCW Card",
    benefit: "Tool Purchase Grant ₹5,000",
    description: "Building and Other Construction Workers Welfare Board scheme provides tool purchase grants, education aid for children, and medical assistance.",
    applyLink: "https://labour.gov.in/bocw",
    isEligible: true,
    eligibilityCriteria: { minAge: 18, maxAge: 60, roles: ["Mason", "Carpenter", "Welder", "Plumber", "Painter", "Electrician"] },
  },
  {
    id: "scheme-3",
    title: "PM-SYM Pension",
    benefit: "₹3,000/month after age 60",
    description: "Pradhan Mantri Shram Yogi Maan-dhan pension scheme for unorganized workers with monthly income below ₹15,000.",
    applyLink: "https://pmsym.csc.gov.in",
    isEligible: true,
    eligibilityCriteria: { minAge: 18, maxAge: 40, maxIncome: 15000 },
  },
  {
    id: "scheme-4",
    title: "PMAY Housing",
    benefit: "Subsidy up to ₹2.67 Lakh",
    description: "Pradhan Mantri Awas Yojana provides housing subsidy for economically weaker sections to build pucca houses.",
    applyLink: "https://pmaymis.gov.in",
    isEligible: true,
    eligibilityCriteria: { maxIncome: 300000 },
  },
  {
    id: "scheme-5",
    title: "NSP Scholarships",
    benefit: "Up to ₹10,000/year for children",
    description: "National Scholarship Portal offers various scholarships for children of unorganized sector workers based on income threshold.",
    applyLink: "https://scholarships.gov.in",
    isEligible: false,
    eligibilityCriteria: { maxIncome: 200000 },
  },
];

// =============================================
// HELPER: Wage Fairness Check
// =============================================
export function checkWageFairness(state: string, skill: string, offeredWage: number): {
  isFair: boolean;
  minimumWage: number | null;
  message: string;
} {
  const entry = minimumWages.find(
    (w) => w.state === state && w.skill === skill
  );
  if (!entry) {
    return { isFair: true, minimumWage: null, message: "Minimum wage data not available for this combination." };
  }
  if (offeredWage >= entry.dailyWage) {
    return { isFair: true, minimumWage: entry.dailyWage, message: `✓ Wage meets the ${state} minimum of ₹${entry.dailyWage}/day for ${skill}.` };
  }
  return {
    isFair: false,
    minimumWage: entry.dailyWage,
    message: `⚠ Below ${state} minimum wage of ₹${entry.dailyWage}/day for ${skill}. Please revise.`,
  };
}
