
// 必要なSDKをインポート
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";


// Firebase の設定を環境変数から取得
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY|| "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN|| "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID|| "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET|| "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID|| "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID|| "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "", // 省略可能な値
};

console.log("Firebase Config:", firebaseConfig);


// Firebase の初期化
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// 認証オブジェクトの準備
const auth: Auth = getAuth(firebaseApp);

// Google 認証プロバイダの準備
const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

export { firebaseApp, auth, googleProvider };



// 前々回
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth} from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";


// // 環境変数から Firebase 設定を取得
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
// };

// // Firebase を初期化
// const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);


// // Firebase サービスを取得
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { app, auth, db, storage };
