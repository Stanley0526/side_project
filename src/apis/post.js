import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

// 新增一篇文章
export const createPost = async (imageUrl, description) => {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");

  const newPost = {
    userId: user.uid,
    imageUrl,
    description,
    createdAt: serverTimestamp(),
    liked_bies: 0,
    favored_bies: 0,
    comments: 0,
  };

  const docRef = await addDoc(collection(db, "posts"), newPost);
  return docRef.id;
};

// 載入所有文章

export async function loadPosts(searchTerm = "") {
  const postsRef = collection(db, "posts");
  let q;

  if (searchTerm) {
    q = query(
      postsRef,
      where("description", ">=", searchTerm),
      where("description", "<=", searchTerm + "\uf8ff")
    );
  } else {
    q = query(postsRef); // ⚡ 一定要包成 query
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

  const postSnapshot = await getDoc(postRef); // ← 這裡你之前是 getDocs() 其實應該是 getDoc()
  const postData = postSnapshot.data();

  if (!postData) return false;

  const newLiked = (postData.liked_bies || 0) + 1;
  await updateDoc(postRef, { liked_bies: newLiked });
  return true;
}

// 收藏
export async function favorPost(postId) {
  const postRef = doc(db, "posts", postId);

  const postSnapshot = await getDoc(postRef); // 同樣這裡 getDoc()
  const postData = postSnapshot.data();

  if (!postData) return false;

  const newFavored = (postData.favored_bies || 0) + 1;
  await updateDoc(postRef, { favored_bies: newFavored });
  return true;
}
