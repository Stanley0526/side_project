<template>
  <div class="loginPage">
    <img src="../assets/phone.png" alt="" class="phoneImage" />
    <div class="loginForm">
      <img src="../assets/logo.svg" alt="" />
      <form @submit.prevent="isLogin ? login() : register()">
        <input type="email" placeholder="email" v-model="email" />
        <input
          v-if="!isLogin"
          type="text"
          placeholder="用戶名"
          v-model="username"
        />
        <input type="password" placeholder="密碼" v-model="password" />
        <button type="submit" class="loginButton">
          {{ isLogin ? "登入" : "註冊" }}
        </button>
        <p @click="isLogin = !isLogin" class="info">
          {{ isLogin ? "還沒有帳號？點選註冊" : "已有帳號？點擊登入" }}
        </p>
        <div v-if="!isLogin" class="agreement">
          <input type="checkbox" v-model="agreementChecked" />
          勾選表示同意隱私協議和使用規範
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const isLogin = ref(true);

const email = ref("");
const username = ref("");
const password = ref("");
const agreementChecked = ref(false);

const store = useStore();
const router = useRouter();

async function register() {
  if (!agreementChecked.value) {
    alert("請先閱讀並同意隱私權協議和使用規範");
    return;
  }
  try {
    await store.dispatch("registerUser", {
      email: email.value,
      username: username.value,
      password: password.value,
    });
    router.replace("/");
  } catch (err) {
    console.error("註冊失敗", err);
    alert("註冊失敗：" + (err.message || "請稍後再試"));
  }
}

async function login() {
  try {
    await store.dispatch("loginUser", {
      email: email.value,
      password: password.value,
    });
    console.log("登入成功");

    router.replace("/");
  } catch (err) {
    console.error("登入失敗", err);
    alert("登入失敗：" + (err.message || "請稍後再試"));
  }
}
</script>
<style scoped>
.loginPage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5vw;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  background: #f8f9fb;

  padding: 0 10vw;
}

.phoneImage {
  max-width: 400px;
  position: relative;
  top: 36px;
  justify-self: end;
}

.loginForm {
  justify-self: start;
  box-shadow: 0px 4px 48px rgba(0, 0, 0, 0.06);
  border-radius: 32px;
  background: white;
  padding: 74px 60px;

  display: grid;
  place-items: center;
  row-gap: 52px;
  width: 380px;
}
.loginForm > form {
  display: grid;
  row-gap: 24px;
  width: 100%;
  height: 100%;
}

input {
  background: #fafafa;
  border-radius: 4px;
  border: none;
}

input::placeholder {
  color: #9e9e9e;
}

.loginButton {
  background: linear-gradient(89.93deg, #00c2ff 0.06%, #0047ff 105.68%);
  padding: 12px 0;
  color: white;
  border: none;
}

.info {
  color: #1da0ff;
  text-align: center;
  cursor: pointer;
}

.agreement {
  color: #a1a1a1;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
