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

// import { createContext, useContext, useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useRouter } from "next/router";



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
    // Firebase IDトークンを取得
    const token = await newUser.getIdToken();
    console.log("Token:", token); // デバッグ用

    console.log("##signup##")
    // バックエンドへトークンを送信
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token_request: { token }, // 🔹 token_request 内に token を入れる
        user_data: { // 🔹 user_data 内に email, name, password を入れる
          email,
          name: displayName,
          password,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

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

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const router = useRouter();
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const idToken = await currentUser.getIdToken();
//         setUser({ ...currentUser, idToken });
//       } else {
//         setUser(null);
//       }
//     });
//     return () => unsubscribe();
//   }, [auth]);

//   // 健康診断データをバックエンドに送信する関数
//   const submitHealthData = async (healthData) => {
//     if (!user || !user.idToken) {
//       console.error("ユーザーが認証されていません");
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health_records`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.idToken}`, // FirebaseのIDトークンを送信
//         },
//         body: JSON.stringify(healthData),
//       });

//       if (!response.ok) {
//         throw new Error("健康診断データの送信に失敗しました");
//       }

//       const result = await response.json();
//       console.log("送信成功:", result);
//       return result;
//     } catch (error) {
//       console.error("エラー:", error);
//       return null;
//     }
//   };

//   return (
//     // eslint-disable-next-line react/react-in-jsx-scope
//     <AuthContext.Provider value={{ user, submitHealthData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }