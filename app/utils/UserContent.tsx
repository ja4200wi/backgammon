// UserContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { getUserName } from '../service/profileService';

interface UserContextType {
  user: string | null;
  loading: boolean;
}

// Define the props for the UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

// Create the context with an initial default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await getUserName();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Provide user data and loading state to the context
  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the UserContext with proper type checking
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
