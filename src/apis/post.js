import { db } from "@/firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from "firebase/firestore";

// 新增一篇文章
export async function createPost(imageUrl, description) {
  const postsRef = collection(db, "posts");
  const createdAt = new Date();

  await addDoc(postsRef, {
    imageUrl,
    description,
    liked_bies: 0,
    favored_bies: 0,
    comments: 0,
    createdAt,
  });
}

// 載入所有文章
export async function loadPosts(searchTerm = "") {
  const postsRef = collection(db, "posts");
  let q = postsRef;

  if (searchTerm) {
    q = query(postsRef, where("description", ">=", searchTerm), where("description", "<=", searchTerm + "\uf8ff"));
  }

  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

// 按讚
export async function likePost(postId) {
  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDocs(collection(db, "posts"));
  const postData = postSnapshot.docs.find(doc => doc.id === postId)?.data();

  if (!postData) return false;

  const newLiked = (postData.liked_bies || 0) + 1;
  await updateDoc(postRef, { liked_bies: newLiked });
  return true;
}

// 收藏
export async function favorPost(postId) {
  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDocs(collection(db, "posts"));
  const postData = postSnapshot.docs.find(doc => doc.id === postId)?.data();

  if (!postData) return false;

  const newFavored = (postData.favored_bies || 0) + 1;
  await updateDoc(postRef, { favored_bies: newFavored });
  return true;
}
