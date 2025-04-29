import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

// 建立一個新留言
export async function createComment(content, postId) {
  const commentsRef = collection(db, "comments");
  const createdAt = new Date();

  await addDoc(commentsRef, {
    postId,
    content,
    createdAt,
  });
}

// 載入特定文章的所有留言
export async function loadComments(postId) {
  const commentsRef = collection(db, "comments");

  const q = query(
    commentsRef,
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );

  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return comments;
}
