import HomePage from "./pages/HomePage.vue";
import SearchPage from "./pages/SearchPage.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import ProfileEdittingPage from "./pages/ProfileEdittingPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import { getUser } from "./apis/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/search_result",
    name: "search_result",
    component: SearchPage,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
  },
  {
    path: "/profile/edit",
    name: "profileEdit",
    component: ProfileEdittingPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});

// router.beforeEach((to) => {
//   const user = getUser();
//   if (!user && to.name !== "login") {
//     return { name: "login" };
//   }
//   if (user && to.name === "login") {
//     return { name: "home" };
//   }
// });

export { router };
