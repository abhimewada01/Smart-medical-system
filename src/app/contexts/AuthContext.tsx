import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clinicName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medicareclinic.com',
    password: 'admin123',
    phone: '+91 9876543210',
    address: '123 Medical Center, Delhi, India 110001',
    clinicName: 'MediCare Central Clinic',
    role: 'Administrator',
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@medicareclinic.com',
    password: 'doctor123',
    phone: '+91 8765432109',
    address: '456 Hospital Road, Mumbai, India 400001',
    clinicName: 'City Health Clinic',
    role: 'Doctor',
    avatar: 'RK'
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@medicareclinic.com',
    password: 'nurse123',
    phone: '+91 7654321098',
    address: '789 Nursing Home, Bangalore, India 560001',
    clinicName: 'Care Medical Center',
    role: 'Nurse',
    avatar: 'PS'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('userData');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('Auth initialized with user:', userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const authToken = `token_${Date.now()}_${foundUser.id}`;
        
        // Save to state
        setUser(foundUser);
        setToken(authToken);
        
        // Save to localStorage for persistence
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(foundUser));
        
        console.log('User logged in successfully:', foundUser);
        return true;
      } else {
        console.log('Login failed: Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    console.log('User logged out');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    console.log('User data updated:', updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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
