<template>
  <div>
    <PostList>
      <PostItem v-for="post in posts" :post="post" :key="post.id" />
    </PostList>
    <PostDetails v-if="showPostDetails" />
    <PostUpload v-if="showPostUpload" />
  </div>
</template>
<script setup>
import PostList from "../components/PostList.vue";
import PostItem from "../components/PostItem.vue";
import PostUpload from "../components/PostUpload.vue";
import PostDetails from "../components/PostDetails.vue";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";

const store = useStore();
const showPostUpload = computed(() => store.state.showPostUpload);
const showPostDetails = computed(() => store.state.showPostDetails);
const posts = computed(() => store.state.post.list);

onMounted(() => {
  store.dispatch("loadAllPosts")
    .then(() => {
      console.log("載入的 posts：", posts.value);
    })
    .catch((error) => {
      console.error("載入 posts 出錯了！", error);
    });
});

</script>
<style scoped></style>
