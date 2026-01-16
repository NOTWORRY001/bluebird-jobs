import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  speak: (text: string) => void;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Auth
    'auth.welcome': 'Welcome',
    'auth.selectRole': 'I am looking for',
    'auth.worker': 'Work',
    'auth.admin': 'Workers',
    'auth.workerDesc': 'I want to find jobs',
    'auth.adminDesc': 'I want to hire workers',
    'auth.enterPhone': 'Enter phone number',
    'auth.sendOtp': 'Send OTP',
    'auth.verifyOtp': 'Verify OTP',
    'auth.enterOtp': 'Enter OTP sent to your phone',
    
    // Navigation
    'nav.home': 'Home',
    'nav.jobs': 'Jobs',
    'nav.applications': 'My Jobs',
    'nav.profile': 'Profile',
    'nav.postJob': 'Post Job',
    'nav.workers': 'Workers',
    'nav.payments': 'Payments',
    
    // Worker
    'worker.nearbyJobs': 'Jobs Near You',
    'worker.apply': 'I\'m Interested',
    'worker.applied': 'Applied',
    'worker.distance': 'km away',
    'worker.salary': 'Salary',
    'worker.shift': 'Shift',
    'worker.location': 'Location',
    
    // Profile
    'profile.name': 'Name',
    'profile.phone': 'Phone',
    'profile.category': 'Job Type',
    'profile.experience': 'Experience',
    'profile.years': 'years',
    'profile.availability': 'Availability',
    'profile.available': 'Available',
    'profile.busy': 'Busy',
    'profile.unavailable': 'Not Available',
    'profile.uploadVideo': 'Upload Video Introduction',
    'profile.uploadVoice': 'Record Voice Introduction',
    'profile.save': 'Save Profile',
    
    // Admin
    'admin.postJob': 'Post New Job',
    'admin.jobTitle': 'Job Title',
    'admin.jobType': 'Job Type',
    'admin.salary': 'Salary/Wage',
    'admin.shift': 'Shift Timing',
    'admin.location': 'Location',
    'admin.post': 'Post Job',
    'admin.applicants': 'Applicants',
    'admin.select': 'Select',
    'admin.reject': 'Reject',
    'admin.markJoined': 'Mark as Joined',
    'admin.call': 'Call',
    
    // Status
    'status.applied': 'Applied',
    'status.selected': 'Selected',
    'status.joined': 'Joined',
    'status.completed': 'Completed',
    
    // Common
    'common.logout': 'Logout',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
  },
  hi: {
    // Auth
    'auth.welcome': 'स्वागत है',
    'auth.selectRole': 'मुझे चाहिए',
    'auth.worker': 'काम',
    'auth.admin': 'कामगार',
    'auth.workerDesc': 'मुझे काम चाहिए',
    'auth.adminDesc': 'मुझे काम करने वाले चाहिए',
    'auth.enterPhone': 'फोन नंबर डालें',
    'auth.sendOtp': 'OTP भेजें',
    'auth.verifyOtp': 'OTP सत्यापित करें',
    'auth.enterOtp': 'अपने फोन पर भेजा गया OTP दर्ज करें',
    
    // Navigation
    'nav.home': 'होम',
    'nav.jobs': 'नौकरियां',
    'nav.applications': 'मेरे काम',
    'nav.profile': 'प्रोफाइल',
    'nav.postJob': 'नौकरी पोस्ट करें',
    'nav.workers': 'कामगार',
    'nav.payments': 'भुगतान',
    
    // Worker
    'worker.nearbyJobs': 'आस-पास की नौकरियां',
    'worker.apply': 'मुझे रुचि है',
    'worker.applied': 'आवेदन किया',
    'worker.distance': 'किमी दूर',
    'worker.salary': 'वेतन',
    'worker.shift': 'शिफ्ट',
    'worker.location': 'स्थान',
    
    // Profile
    'profile.name': 'नाम',
    'profile.phone': 'फोन',
    'profile.category': 'काम का प्रकार',
    'profile.experience': 'अनुभव',
    'profile.years': 'साल',
    'profile.availability': 'उपलब्धता',
    'profile.available': 'उपलब्ध',
    'profile.busy': 'व्यस्त',
    'profile.unavailable': 'उपलब्ध नहीं',
    'profile.uploadVideo': 'वीडियो परिचय अपलोड करें',
    'profile.uploadVoice': 'आवाज परिचय रिकॉर्ड करें',
    'profile.save': 'प्रोफाइल सहेजें',
    
    // Admin
    'admin.postJob': 'नई नौकरी पोस्ट करें',
    'admin.jobTitle': 'नौकरी का शीर्षक',
    'admin.jobType': 'नौकरी का प्रकार',
    'admin.salary': 'वेतन/मजदूरी',
    'admin.shift': 'शिफ्ट का समय',
    'admin.location': 'स्थान',
    'admin.post': 'नौकरी पोस्ट करें',
    'admin.applicants': 'आवेदक',
    'admin.select': 'चुनें',
    'admin.reject': 'अस्वीकार करें',
    'admin.markJoined': 'शामिल हुआ चिह्नित करें',
    'admin.call': 'कॉल करें',
    
    // Status
    'status.applied': 'आवेदन किया',
    'status.selected': 'चुना गया',
    'status.joined': 'शामिल हुआ',
    'status.completed': 'पूरा हुआ',
    
    // Common
    'common.logout': 'लॉग आउट',
    'common.back': 'वापस',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.loading': 'लोड हो रहा है...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, speak }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
