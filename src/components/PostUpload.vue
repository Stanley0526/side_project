<template>
  <TheModal @close="store.commit('changeShowPostUpload', false)">
    <div class="postUpload">
      <label class="upload">
        <img v-if="imageObjUrl" :src="imageObjUrl" class="preview" />
        <img v-else src="../assets/upload.png" alt="">
        <input
          type="file"
          accept="image/*"
          class="fileChooser"
          @change="handleImageUpload"
        />
      </label>
      <div class="postContent">
        <textarea
          placeholder="在想什麼呢?"
          class="postContentInput"
          v-model="description"
        ></textarea>
        <TheButton class="pubBtn" @click="publishPost">發布</TheButton>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import TheModal from "./TheModal.vue";
import TheButton from "./TheButton.vue";
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { storage } from "../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const store = useStore();

const image = ref(null);
const imageObjUrl = ref("");
const description = ref("");
const user = computed(() => store.state.user.user);

function handleImageUpload(e) {
  const imageFile = e.target.files[0];
  if (imageFile) {
    imageObjUrl.value = URL.createObjectURL(imageFile);
    image.value = imageFile;
  }
}

async function publishPost() {
  if (!image.value) return;

  const filename = `${Date.now()}-${image.value.name}`;
  const imageRef = storageRef(storage, `post-images/${filename}`);

  try {
    await uploadBytes(imageRef, image.value); // ✅ 這裡用 SDK 上傳
    const url = await getDownloadURL(imageRef);

    await store.dispatch("uploadPost", {
      imageUrl: url,
      description: description.value,
    });
  } catch (err) {
    console.error("圖片上傳或貼文發布失敗:", err);
  }
}
</script>

<style scoped>
.postUpload {
  width: 50vw;
  height: 70vh;
  display: grid;
  grid-template-rows: 4fr 1fr;
}

.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 0;
}
.upload {
  display: grid;
  place-items: center;
  cursor: pointer;
  min-height: 0;
}
.upload > svg {
  width: 254px;
  height: 316px;
}

.fileChooser {
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

.postContent {
  display: grid;
}
.postContentInput {
  border-bottom: none;
  resize: none;
  padding: 12px 24px;
}

.postContentInput::placeholder {
  color: #757575;
}

.pubBtn {
  align-self: end;
  justify-self: end;
  position: relative;
  right: 24px;
  bottom: 18px;
}

.upload > img {
  width: 280px;
}

h5 {
  font-size: 40px;
}
</style>
