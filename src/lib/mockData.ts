// Mock data for the application (will be replaced with Supabase later)

export interface User {
  id: string;
  role: 'worker' | 'admin';
  phone: string;
  email?: string;
  createdAt: string;
}

export interface WorkerProfile {
  userId: string;
  name: string;
  photo?: string;
  jobCategory: string;
  experienceYears: number;
  availability: 'available' | 'busy' | 'unavailable';
  introMediaUrl?: string;
  introMediaType?: 'video' | 'audio';
  aadhaarNumber?: string;
  pastExperience?: string[];
}

export interface AdminProfile {
  userId: string;
  businessName: string;
  location: string;
  contactNumber: string;
  phone?: string;
  profilePhoto?: string;
}

export interface Job {
  id: string;
  adminId: string;
  adminName: string;
  jobTitle: string;
  jobType: string;
  salary: string;
  shift: string;
  location: string;
  landmark: string;
  latitude: number;
  longitude: number;
  distance?: number;
  createdAt: string;
  voiceDescriptionUrl?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerPhoto?: string;
  workerCategory: string;
  workerExperience: number;
  introMediaUrl?: string;
  status: 'applied' | 'selected' | 'joined' | 'completed';
  appliedAt: string;
}

export interface Payment {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  joiningDate: string;
  salaryAmount: number;
  paymentStatus: 'pending' | 'paid';
}

export interface Feedback {
  id: string;
  jobId: string;
  workerId: string;
  adminId: string;
  rating: 'good' | 'average' | 'poor';
  voiceFeedbackUrl?: string;
}

// Job categories with icons
export const jobCategories = [
  { id: 'construction', name: 'Construction', nameHi: 'निर्माण', icon: 'HardHat' },
  { id: 'cleaning', name: 'Cleaning', nameHi: 'सफाई', icon: 'Sparkles' },
  { id: 'cooking', name: 'Cooking', nameHi: 'खाना बनाना', icon: 'ChefHat' },
  { id: 'driving', name: 'Driving', nameHi: 'ड्राइविंग', icon: 'Car' },
  { id: 'security', name: 'Security', nameHi: 'सुरक्षा', icon: 'Shield' },
  { id: 'delivery', name: 'Delivery', nameHi: 'डिलीवरी', icon: 'Package' },
  { id: 'gardening', name: 'Gardening', nameHi: 'बागवानी', icon: 'Flower2' },
  { id: 'electrician', name: 'Electrician', nameHi: 'इलेक्ट्रीशियन', icon: 'Zap' },
  { id: 'plumber', name: 'Plumber', nameHi: 'प्लंबर', icon: 'Wrench' },
  { id: 'helper', name: 'Helper', nameHi: 'हेल्पर', icon: 'HandHelping' },
];

// Mock jobs data
export const mockJobs: Job[] = [
  {
    id: '1',
    adminId: 'admin1',
    adminName: 'Sharma Construction',
    jobTitle: 'Construction Worker',
    jobType: 'construction',
    salary: '₹500/day',
    shift: 'Morning (6 AM - 2 PM)',
    location: 'Sector 62, Noida',
    landmark: 'Near Metro Station',
    latitude: 28.6273,
    longitude: 77.3714,
    distance: 1.2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    adminId: 'admin2',
    adminName: 'Clean Home Services',
    jobTitle: 'House Cleaner',
    jobType: 'cleaning',
    salary: '₹400/day',
    shift: 'Full Day (8 AM - 6 PM)',
    location: 'DLF Phase 3, Gurgaon',
    landmark: 'Near Cyber Hub',
    latitude: 28.4949,
    longitude: 77.0889,
    distance: 2.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    adminId: 'admin3',
    adminName: 'Royal Kitchen',
    jobTitle: 'Cook / Chef',
    jobType: 'cooking',
    salary: '₹15,000/month',
    shift: 'Evening (4 PM - 10 PM)',
    location: 'Connaught Place, Delhi',
    landmark: 'Near Rajiv Chowk Metro',
    latitude: 28.6304,
    longitude: 77.2177,
    distance: 3.8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    adminId: 'admin1',
    adminName: 'Sharma Construction',
    jobTitle: 'Electrician',
    jobType: 'electrician',
    salary: '₹600/day',
    shift: 'Morning (8 AM - 4 PM)',
    location: 'Sector 18, Noida',
    landmark: 'Near Atta Market',
    latitude: 28.5707,
    longitude: 77.3260,
    distance: 4.2,
    createdAt: new Date().toISOString(),
  },
];

// Mock applications data
export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    workerId: 'worker1',
    workerName: 'Ramesh Kumar',
    workerPhoto: undefined,
    workerCategory: 'construction',
    workerExperience: 5,
    status: 'applied',
    appliedAt: new Date().toISOString(),
  },
  {
    id: '2',
    jobId: '1',
    workerId: 'worker2',
    workerName: 'Suresh Yadav',
    workerCategory: 'construction',
    workerExperience: 3,
    status: 'selected',
    appliedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Languages supported
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];
