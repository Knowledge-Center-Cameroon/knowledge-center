import React from "react";
import {
  GspUser,
  clearAuthToken,
  getCurrentUser,
  hasAuthToken,
  loginGsp,
  persistAuthTokens,
} from "@/services/gspApi";

type AuthContextValue = {
  user: GspUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setAuthenticatedUser: (user: GspUser | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const GspAuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const GspAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<GspUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    if (!hasAuthToken()) {
      setUser(null);
      return;
    }
    try {

      const me = await getCurrentUser();
      setUser(me.user);
    } catch {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    const run = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };
    run();
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    const data = await loginGsp({ email, password });
    persistAuthTokens(data);
    setUser(data.user);
  };

  const signOut = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <GspAuthContext.Provider value={{ user, loading, refreshUser, setAuthenticatedUser: setUser, signIn, signOut }}>
      {children}
    </GspAuthContext.Provider>
  );
};

export function useGspAuth() {
  const ctx = React.useContext(GspAuthContext);
  if (!ctx) throw new Error("useGspAuth must be used within GspAuthProvider");
  return ctx;
}
