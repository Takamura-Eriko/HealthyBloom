"use client";

import { AuthContext } from "./auth"; // `auth.ts` をインポート
import { ReactNode, useState, useEffect } from "react";
import type { User } from "firebase/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {} as User;
  };

  const signIn = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({} as User);
    return {} as User;
  };

  const signOut = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
