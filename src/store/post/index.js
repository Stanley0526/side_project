// 引入 Firebase 相關操作
import { createPost, loadPosts, likePost, favorPost } from "@/apis/post";

export const post = {
  state() {
    return {
      list: [],
      searchResult: [],
      currentId: null,
    };
  },
  mutations: {
    initializePosts(state, posts) {
      state.list = posts;
    },
    toggleLike(state, { id, isLike }) {
      const post = state.list.find((post) => post.id === id);
      if (post) {
        post.liked_bies = (post.liked_bies || 0) + (isLike ? 1 : -1);
        post.likedByMe = isLike;
      }
    },
    toggleFavor(state, { id, isFavor }) {
      const post = state.list.find((post) => post.id === id);
      if (post) {
        post.favored_bies = (post.favored_bies || 0) + (isFavor ? 1 : -1);
        post.favoredByMe = isFavor;
      }
    },
    setCurrentId(state, id) {
      state.currentId = id;
    },
    increaseCommentCount(state, id) {
      const post = state.list.find((post) => post.id === id);
      if (post) post.comments++;
    },
    setPostsSearchResult(state, posts) {
      state.searchResult = posts;
    },
  },
  actions: {
    async uploadPost({ commit, dispatch }, { imageUrl, description }) {
      await createPost(imageUrl, description);
      await dispatch("loadAllPosts");
      commit("changeShowPostUpload", false);  // 這個 mutation 應該在另外一個 store，如 UI 控制
    },
    async loadAllPosts({ commit }) {
      const posts = await loadPosts();
      commit("initializePosts", posts);
    },
    async toggleLike({ commit }, id) {
      const isLike = await likePost(id);
      commit("toggleLike", { id, isLike });
    },
    async toggleFavor({ commit }, id) {
      const isFavor = await favorPost(id);
      commit("toggleFavor", { id, isFavor });
    },
    async showPostDetails({ commit, dispatch }, id) {
      commit("setCurrentId", id);
      dispatch("loadAllComments", id);  // 這個 action 可能在 comments store
      commit("changeShowPostDetails", true);
    },
    async hidePostDetails({ commit }) {
      commit("setCurrentId", null);
      commit("changeShowPostDetails", false);
    },
    async searchPosts({ commit }, term) {
      const posts = await loadPosts(term);  // 支援搜尋功能
      commit("setPostsSearchResult", posts);
    },
  },
  getters: {
    postDetails(state) {
      return state.list.find((post) => post.id === state.currentId);
    },
  },
};
