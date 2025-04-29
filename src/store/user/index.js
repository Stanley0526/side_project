// 引入 firebase 的 auth、firestore
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const user = {
  state() {
    return {
      user: null, // 初始沒有登入
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    // 註冊新使用者
    async registerUser({ commit }, { email, username, password }) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestore 裡不要存密碼！
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date(),
      });

      commit("setUser", {
        uid: user.uid,
        email: user.email,
        username: username,
      });
    },
    // 使用者登入
    async loginUser({ commit }, { email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // 從 Firestore 讀取使用者資料
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          commit("setUser", userDoc.data());
        } else {
          commit("setUser", {
            uid: user.uid,
            email: user.email,
            username: "", // 找不到 Firestore 資料的話，補個空字串也可以
          });
        }
      } catch (error) {
        console.error("loginUser error:", error);
        throw error; // 讓呼叫方 catch 到
      }
    },

    // 更新使用者資料（選擇性）
    async updateUser({ commit }, updatedData) {
      const userRef = doc(db, "users", updatedData.uid);
      await setDoc(userRef, updatedData, { merge: true }); // merge 避免整份覆蓋

      commit("setUser", updatedData);
    },

    // 使用者登出
    async logoutUser({ commit }) {
      await signOut(auth);
      commit("setUser", null);
    },
  },
};
