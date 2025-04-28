import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getUser, saveUser } from "./auth";

// 更新使用者資料
export async function changeUser(user) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("尚未登入，無法更新使用者資料");
  }

  // 更新 Firebase Auth 資料 (例如 displayName)
  await updateProfile(currentUser, {
    displayName: user.username, // 可以改這裡的欄位
    photoURL: user.photoURL || null, // 如果有照片也可以改
  });

  // 更新 Firestore 資料
  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, user);

  // 更新 localStorage 資料
  saveUser({
    id: currentUser.uid,
    email: currentUser.email,
    username: user.username,
    photoURL: user.photoURL || "",
  });

  return getUser();
}
