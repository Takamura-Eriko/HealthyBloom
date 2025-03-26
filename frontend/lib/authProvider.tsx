"use client";

import { AuthContext } from "./auth";
import { ReactNode, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  User
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // メール & パスワードでサインアップ
  const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    if (displayName) {
      await updateProfile(newUser, { displayName });
    }
    
    setUser({ ...newUser, displayName: displayName || newUser.displayName });
    return newUser;
  };

  
// メール & パスワードでログイン + Firebase IDトークンをバックエンドへ送信
const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const loggedInUser = userCredential.user;
  setUser(loggedInUser);

  // Firebase IDトークンを取得
  const token = await loggedInUser.getIdToken();
  console.log("Token:", token); // デバッグ用

  
  // バックエンドへトークンを送信
  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  const data = await response.json();
  console.log("Login response:", data); // デバッグ用
  return loggedInUser;
};


  // Google でログイン
  const googleSignIn = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    return result.user;
  };

  // ログアウト
  const logOut = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  // パスワードリセット
  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    googleSignIn, // Google 認証追加
    signOut: logOut,
    resetPassword,
  };

  // eslint-disable-next-line react/react-in-jsx-scope
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

