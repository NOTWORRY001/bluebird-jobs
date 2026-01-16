import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, WorkerProfile, AdminProfile } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  workerProfile: WorkerProfile | null;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  login: (phone: string, role: 'worker' | 'admin') => Promise<void>;
  logout: () => void;
  updateWorkerProfile: (profile: Partial<WorkerProfile>) => void;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    const savedWorkerProfile = localStorage.getItem('workerProfile');
    const savedAdminProfile = localStorage.getItem('adminProfile');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedWorkerProfile) {
      setWorkerProfile(JSON.parse(savedWorkerProfile));
    }
    if (savedAdminProfile) {
      setAdminProfile(JSON.parse(savedAdminProfile));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, role: 'worker' | 'admin') => {
    // Mock login - will be replaced with Supabase OTP auth
    const newUser: User = {
      id: `user_${Date.now()}`,
      role,
      phone,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    // Create default profile based on role
    if (role === 'worker') {
      const defaultProfile: WorkerProfile = {
        userId: newUser.id,
        name: '',
        jobCategory: '',
        experienceYears: 0,
        availability: 'available',
      };
      setWorkerProfile(defaultProfile);
      localStorage.setItem('workerProfile', JSON.stringify(defaultProfile));
    } else {
      const defaultProfile: AdminProfile = {
        userId: newUser.id,
        businessName: '',
        location: '',
        contactNumber: phone,
      };
      setAdminProfile(defaultProfile);
      localStorage.setItem('adminProfile', JSON.stringify(defaultProfile));
    }
  };

  const logout = () => {
    setUser(null);
    setWorkerProfile(null);
    setAdminProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('workerProfile');
    localStorage.removeItem('adminProfile');
  };

  const updateWorkerProfile = (profile: Partial<WorkerProfile>) => {
    if (workerProfile) {
      const updated = { ...workerProfile, ...profile };
      setWorkerProfile(updated);
      localStorage.setItem('workerProfile', JSON.stringify(updated));
    }
  };

  const updateAdminProfile = (profile: Partial<AdminProfile>) => {
    if (adminProfile) {
      const updated = { ...adminProfile, ...profile };
      setAdminProfile(updated);
      localStorage.setItem('adminProfile', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        adminProfile,
        isLoading,
        login,
        logout,
        updateWorkerProfile,
        updateAdminProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
