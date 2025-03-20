
import { getAuth } from "firebase/auth";

export async function fetchProtectedData() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("ユーザーがログインしていません");

  const idToken = await user.getIdToken();

  const response = await fetch("http://localhost:8000/protected", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) throw new Error("認証エラー");

  return response.json();
}


// import { getAuth } from "firebase/auth";

// export async function fetchProtectedData() {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) throw new Error("ユーザーがログインしていません");

//   const idToken = await user.getIdToken(); // Firebase の JWT トークンを取得

//   const response = await fetch("http://localhost:8000/protected", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${idToken}`,
//     },
//   });

//   if (!response.ok) throw new Error("認証エラー");

//   return response.json();
// }
