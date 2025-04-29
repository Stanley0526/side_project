import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBG3-FSNeiXYuCJlpal0hjN0oy5F27i1AY",
  authDomain: "side-project-aa33a.firebaseapp.com",
  projectId: "side-project-aa33a",
  storageBucket: "side-project-aa33a.appspot.com", 
  messagingSenderId: "818644670887",
  appId: "1:818644670887:web:809ee8807a1938e3cebe82",
  measurementId: "G-7MT3TGMZWV",
};

const app = initializeApp(firebaseConfig);

// 建立物件
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 一次 export
export { app, auth, db, storage };
