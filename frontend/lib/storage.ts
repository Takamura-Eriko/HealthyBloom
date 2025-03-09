import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

// 画像をFirebase Storageにアップロード
export async function uploadImage(file: File, path: string, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
          onProgress(progress)
        }
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      },
    )
  })
}

// Firebase Storageから画像のURLを取得
export async function getImageUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

