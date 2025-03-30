const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 健康データの型定義
export interface HealthData {
  id?: string;
  userId: string;
  date: string;
  age?: number | null;
  gender?: string;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  systolicBP?: number | null;
  diastolicBP?: number | null;
  pulse?: number | null;
  bloodSugar?: number | null;
  hba1c?: number | null;
  totalCholesterol?: number | null;
  hdlCholesterol?: number | null;
  ldlCholesterol?: number | null;
  triglycerides?: number | null;
  uricAcid?: number | null;
  got?: number | null;
  gpt?: number | null;
  rGpt?: number | null;
  anomalies?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

// 健康データを保存
export async function saveHealthData(data: HealthData) {
  
  console.log("##db.ts 健康データ保存##")
  const response = await fetch(`${API_BASE_URL}/health-data`, {
    method: data.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// ユーザーの健康データを取得（日付順）
export async function getUserHealthData(userId: string) {
  const response = await fetch(`${API_BASE_URL}/health-data?userId=${userId}`);
  return await response.json();
}

// 特定の健康データを取得
export async function getHealthDataById(id: string) {
  const response = await fetch(`${API_BASE_URL}/health-data/${id}`);
  return await response.json();
}

// 健康データを削除
export async function deleteHealthData(id: string) {
  await fetch(`${API_BASE_URL}/health-data/${id}`, { method: "DELETE" });
}

// 食事提案の型定義
export interface MealSuggestion {
  id?: string;
  userId: string;
  title: string;
  description: string;
  nutritionType: string[];
  ingredients: string[];
  recipe: string;
  imageUrl?: string;
  createdAt?: string;
}

// 食事提案を保存
export async function saveMealSuggestion(data: MealSuggestion) {
  const response = await fetch(`${API_BASE_URL}/meal-suggestions`, {
    method: data.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// ユーザーの食事提案を取得
export async function getUserMealSuggestions(userId: string, nutritionType?: string) {
  const url = `${API_BASE_URL}/meal-suggestions?userId=${userId}` + (nutritionType ? `&nutritionType=${nutritionType}` : "");
  const response = await fetch(url);
  return await response.json();
}

// 生活習慣アドバイスの型定義
export interface LifestyleAdvice {
  id?: string;
  userId: string;
  category: "exercise" | "sleep" | "stress";
  title: string;
  description: string;
  createdAt?: string;
}

// 生活習慣アドバイスを保存
export async function saveLifestyleAdvice(data: LifestyleAdvice) {
  const response = await fetch(`${API_BASE_URL}/lifestyle-advice`, {
    method: data.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// ユーザーの生活習慣アドバイスを取得
export async function getUserLifestyleAdvice(userId: string, category?: string) {
  const url = `${API_BASE_URL}/lifestyle-advice?userId=${userId}` + (category ? `&category=${category}` : "");
  const response = await fetch(url);
  return await response.json();
}




// import {
//   collection,
//   doc,
//   addDoc,
//   getDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   orderBy,
//   Timestamp,
//   getFirestore,
// } from "firebase/firestore"
// import { firebaseApp } from "./firebase"

// // Firestoreの初期化
// const db = getFirestore(firebaseApp)

// // 健康データの型定義
// export interface HealthData {
//   id?: string
//   userId: string
//   date: string
//   age?: number | null
//   gender?: string
//   height?: number | null
//   weight?: number | null
//   bmi?: number | null
//   systolicBP?: number | null
//   diastolicBP?: number | null
//   pulse?: number | null
//   bloodSugar?: number | null
//   hba1c?: number | null
//   totalCholesterol?: number | null
//   hdlCholesterol?: number | null
//   ldlCholesterol?: number | null
//   triglycerides?: number | null
//   uricAcid?: number | null
//   got?: number | null
//   gpt?: number | null
//   rGpt?: number | null
//   anomalies?: any
//   createdAt?: Timestamp
//   updatedAt?: Timestamp
// }

// // 健康データをFirestoreに保存
// export async function saveHealthData(data: HealthData) {
//   const now = Timestamp.now()

//   // 既存のデータを更新する場合
//   if (data.id) {
//     const docRef = doc(db, "healthData", data.id)
//     await updateDoc(docRef, {
//       ...data,
//       updatedAt: now,
//     })
//     return data.id
//   }
//   // 新しいデータを追加する場合
//   else {
//     const docRef = await addDoc(collection(db, "healthData"), {
//       ...data,
//       createdAt: now,
//       updatedAt: now,
//     })
//     return docRef.id
//   }
// }

// // ユーザーの健康データを取得（日付順）
// export async function getUserHealthData(userId: string) {
//   const healthDataRef = collection(db, "healthData")
//   const q = query(healthDataRef, where("userId", "==", userId), orderBy("date", "desc"))

//   const querySnapshot = await getDocs(q)
//   const healthData: HealthData[] = []

//   querySnapshot.forEach((doc) => {
//     const data = doc.data() as Omit<HealthData, "id">
//     healthData.push({ id: doc.id, ...data })
//   })

//   return healthData
// }

// // 特定の健康データを取得
// export async function getHealthDataById(id: string) {
//   const docRef = doc(db, "healthData", id)
//   const docSnap = await getDoc(docRef)

//   if (docSnap.exists()) {
//     const data = docSnap.data() as Omit<HealthData, "id">
//     return { id: docSnap.id, ...data } as HealthData
//   }

//   return null
// }

// // 健康データを削除
// export async function deleteHealthData(id: string) {
//   const docRef = doc(db, "healthData", id)
//   await deleteDoc(docRef)
// }

// // 食事提案の型定義
// export interface MealSuggestion {
//   id?: string
//   userId: string
//   title: string
//   description: string
//   nutritionType: string[] // 'low-salt', 'low-sugar', 'high-protein' など
//   ingredients: string[]
//   recipe: string
//   imageUrl?: string
//   createdAt?: Timestamp
// }

// // 食事提案をFirestoreに保存
// export async function saveMealSuggestion(data: MealSuggestion) {
//   const now = Timestamp.now()

//   if (data.id) {
//     const docRef = doc(db, "mealSuggestions", data.id)
//     await updateDoc(docRef, {
//       ...data,
//       updatedAt: now,
//     })
//     return data.id
//   } else {
//     const docRef = await addDoc(collection(db, "mealSuggestions"), {
//       ...data,
//       createdAt: now,
//       updatedAt: now,
//     })
//     return docRef.id
//   }
// }

// // ユーザーの食事提案を取得
// export async function getUserMealSuggestions(userId: string, nutritionType?: string) {
//   const mealSuggestionsRef = collection(db, "mealSuggestions")

//   let q = query(mealSuggestionsRef, where("userId", "==", userId))

//   if (nutritionType) {
//     q = query(q, where("nutritionType", "array-contains", nutritionType))
//   }

//   const querySnapshot = await getDocs(q)
//   const mealSuggestions: MealSuggestion[] = []

//   querySnapshot.forEach((doc) => {
//     const data = doc.data() as Omit<MealSuggestion, "id">
//     mealSuggestions.push({ id: doc.id, ...data })
//   })

//   return mealSuggestions
// }

// // 生活習慣アドバイスの型定義
// export interface LifestyleAdvice {
//   id?: string
//   userId: string
//   category: "exercise" | "sleep" | "stress"
//   title: string
//   description: string
//   createdAt?: Timestamp
// }

// // 生活習慣アドバイスをFirestoreに保存
// export async function saveLifestyleAdvice(data: LifestyleAdvice) {
//   const now = Timestamp.now()

//   if (data.id) {
//     const docRef = doc(db, "lifestyleAdvice", data.id)
//     await updateDoc(docRef, {
//       ...data,
//       updatedAt: now,
//     })
//     return data.id
//   } else {
//     const docRef = await addDoc(collection(db, "lifestyleAdvice"), {
//       ...data,
//       createdAt: now,
//       updatedAt: now,
//     })
//     return docRef.id
//   }
// }

// // ユーザーの生活習慣アドバイスを取得
// export async function getUserLifestyleAdvice(userId: string, category?: string) {
//   const adviceRef = collection(db, "lifestyleAdvice")

//   let q = query(adviceRef, where("userId", "==", userId))

//   if (category) {
//     q = query(q, where("category", "==", category))
//   }

//   const querySnapshot = await getDocs(q)
//   const advice: LifestyleAdvice[] = []

//   querySnapshot.forEach((doc) => {
//     const data = doc.data() as Omit<LifestyleAdvice, "id">
//     advice.push({ id: doc.id, ...data })
//   })

//   return advice
// }

