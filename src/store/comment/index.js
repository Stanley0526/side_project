// 引入 Firebase Firestore API 函式
import { createComment, loadComments } from "../../apis/comment";

export const comment = {
  state() {
    return {
      list: [],
    };
  },
  mutations: {
    initializeComments(state, comments) {
      state.list = comments;
    },
  },
  actions: {
    async addComment({ commit, dispatch }, { content, postId }) {
      await createComment(content, postId);
      await dispatch("loadAllComments", postId);  // 留言新增後重新讀取
      commit("increaseCommentCount", postId);     // 更新文章的留言數量（注意這個 commit 是觸發在 post store）
    },
    async loadAllComments({ commit }, postId) {
      const comments = await loadComments(postId);
      commit("initializeComments", comments);
    },
  },
};
