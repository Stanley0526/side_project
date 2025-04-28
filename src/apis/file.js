import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 上傳檔案功能 (Firebase Storage 版)
export async function uploadFile(file) {
  if (!file) throw new Error("沒有選擇檔案");

  const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);
  return url;
}
