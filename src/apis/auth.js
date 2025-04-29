import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// 取得當前登入使用者
export function getUser() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data", error);
    return null;
  }
}

// 儲存使用者到 localStorage
function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// 註冊
export async function register(email, username, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 建立 Firestore 使用者資料
    const userDoc = {
      uid: user.uid,
      email: user.email,
      username: username,
      createdAt: new Date()
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    saveUser(userDoc);
    return userDoc;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// 登入
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 取得 Firestore 上的使用者資料
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (userSnap.exists()) {
      const userData = userSnap.data();
      saveUser(userData);
      return userData;
    } else {
      const fallbackUser = {
        uid: user.uid,
        email: user.email
      };
      saveUser(fallbackUser);
      return fallbackUser;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// 登出
export async function logout() {
  await signOut(auth);
  localStorage.removeItem("user");
}
