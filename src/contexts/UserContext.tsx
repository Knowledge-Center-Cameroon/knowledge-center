import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGspAuth } from './GspAuthContext';
import { updateCurrentUser } from '@/services/gspApi';

interface User {
  id: string;
  name?: string;
  email?: string;
  isAnonymous: boolean;
}

interface UserContextType {
  user: User | null;
  setUserName: (name: string) => void;
  generateAnonymousUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { user: portalUser } = useGspAuth();

  // Generate a unique user ID for this browser session
  const generateUserId = (): string => {
    let userId = localStorage.getItem('kc_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('kc_user_id', userId);
    }
    return userId;
  };

  // Generate anonymous user
  const generateAnonymousUser = () => {
    const userId = generateUserId();
    setUser({
      id: userId,
      name: undefined,
      isAnonymous: true,
    });
  };

  // Set custom user name
  const setUserName = (name: string) => {
    const cleanName = name.trim();
    if (!user) {
      generateAnonymousUser();
      return;
    }

    const updatedUser = { ...user, name: cleanName || undefined, isAnonymous: !cleanName && user.isAnonymous };
    setUser(updatedUser);
    localStorage.setItem('kc_user_name', cleanName);
    if (portalUser && cleanName) {
      updateCurrentUser({ name: cleanName }).catch(() => undefined);
    }
  };

  useEffect(() => {
    if (portalUser) {
      setUser({
        id: portalUser.id,
        name: portalUser.name || portalUser.email?.split("@")[0],
        email: portalUser.email,
        isAnonymous: false,
      });
      return;
    }

    // Check if user already exists in localStorage
    const storedUserId = localStorage.getItem('kc_user_id');
    const storedUserName = localStorage.getItem('kc_user_name');

    if (storedUserId) {
      setUser({
        id: storedUserId,
        name: storedUserName || undefined,
        isAnonymous: !storedUserName,
      });
    } else {
      // Generate anonymous user if none exists
      generateAnonymousUser();
    }
  }, [portalUser]);

  const value: UserContextType = {
    user,
    setUserName,
    generateAnonymousUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
