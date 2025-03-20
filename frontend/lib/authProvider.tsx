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

  // メール & パスワードでログイン
  const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential.user;
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


// "use client";

// import { AuthContext } from "./auth";
// import { ReactNode, useState, useEffect } from "react";
// import { 
//   getAuth, 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut, 
//   sendPasswordResetEmail, 
//   onAuthStateChanged,
//   updateProfile
// } from "firebase/auth";
// import type { User } from "firebase/auth";

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const auth = getAuth();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   const signUp = async (email: string, password: string, displayName: string) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const newUser = userCredential.user;
//     await updateProfile(newUser, { displayName });
//     setUser(newUser);
//     return newUser;
//   };

//   const signIn = async (email: string, password: string) => {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     setUser(userCredential.user);
//     return userCredential.user;
//   };

//   const logOut = async () => {
//     await signOut(auth);
//     setUser(null);
//   };

//   const resetPassword = async (email: string) => {
//     await sendPasswordResetEmail(auth, email);
//   };

//   const value = {
//     user,
//     loading,
//     signUp,
//     signIn,
//     signOut: logOut,
//     resetPassword,
//   };

//   return (
//     // eslint-disable-next-line react/react-in-jsx-scope
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
