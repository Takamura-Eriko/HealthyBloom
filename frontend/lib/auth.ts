"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

// AuthContext の型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// `AuthContext` の定義
export const AuthContext = createContext<AuthContextType | null>(null);

// `useAuth` フックの定義
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
