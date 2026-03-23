import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'producer'; // admin, customer (chủ hộ sản xuất), or producer
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mylongai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock users database
      const mockUsers = [
        {
          id: 'admin-001',
          email: 'admin@mylongai.com',
          password: 'admin123',
          name: 'Admin System',
          role: 'admin' as const
        },
        {
          id: 'admin-002',
          email: 'admin@example.com',
          password: 'admin',
          name: 'Quản trị viên',
          role: 'admin' as const
        },
        {
          id: 'customer-001',
          email: 'customer@mylongai.com',
          password: 'customer123',
          name: 'Nguyễn Văn A',
          role: 'customer' as const
        },
        {
          id: 'customer-002',
          email: 'producer@example.com',
          password: 'producer',
          name: 'Chủ hộ sản xuất',
          role: 'customer' as const
        },
        {
          id: 'customer-003',
          email: 'user@example.com',
          password: 'user123',
          name: 'Người dùng',
          role: 'customer' as const
        }
      ];

      // Find user by email and password
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const mockUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };

      // Save to localStorage first
      localStorage.setItem('mylongai_user', JSON.stringify(mockUser));

      // Then update state - this will trigger re-render
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock registration - new users are customers by default
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'customer'
      };

      // Save to localStorage first
      localStorage.setItem('mylongai_user', JSON.stringify(mockUser));

      // Then update state - this will trigger re-render
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mylongai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
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