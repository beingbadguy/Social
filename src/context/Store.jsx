import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useCallback, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { VscGlobe } from "react-icons/vsc";

export const FirebaseContext = createContext();

const MainContext = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("social")));
  const [profilePost, setProfilePost] = useState([]);
  const [post, setPost] = useState([]);
  const [likes, setLikes] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  console.log(likes);

  const fetchPost = async (userProfile) => {
    try {
      const allPromise = userProfile.posts.map(async (post) => {
        const postRef = doc(db, "posts", post);
        const postData = await getDoc(postRef);
        return postData.data();
      });
      const post = await Promise.all(allPromise);
      setProfilePost(post);
      console.log("it is called");
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchAllPost = async () => {
    setPostLoading(true);
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc")
      );
      const response = await getDocs(postsQuery);
      const posts = response.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        // const likedByUser = postData.likes.includes(user.user_id);
        // setLikes((prevLikes) => ({
        //   ...prevLikes,
        //   [postDoc.id]: likedByUser,
        // }));

        if (postData.userId) {
          const userRef = doc(db, "users", postData.userId);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            return { ...postData, user: userData, postID: postDoc.id };
          }
        }
        return postData; // Return post without user data if userId not found
      });

      const FinalPostData = await Promise.all(posts);
      setPost(FinalPostData); // Now setting post data correctly
      console.log(FinalPostData);
      setPostLoading(false);
    } catch (error) {
      console.log("Error fetching posts:", error.message);
      setPostLoading(false);
    }
  };

  const likeUnlikePost = async (postID, userID) => {
    try {
      const docRef = doc(db, "posts", postID);
      const getPost = await getDoc(docRef);
      const postData = getPost.data();

      const updatedLikes = postData.likes.includes(userID);

      // Update Firestore document
      if (updatedLikes) {
        await updateDoc(docRef, {
          likes: arrayRemove(userID),
        });
        console.log(likes);
        // const updatedLikesData = likes?.filter((id) => id !== userID);
        // setLikes(updatedLikesData);
      } else {
        await updateDoc(docRef, {
          likes: [...postData.likes, userID],
        });
        setLikes((prevLikes) => ({
          ...prevLikes,
          postID,
        }));
      }

      // Update `post` state locally
      setPost((prevPosts) =>
        prevPosts.map((post) =>
          post.postID === postID
            ? {
                ...post,
                likes: updatedLikes
                  ? post.likes.filter((id) => id !== userID)
                  : [...post.likes, userID],
              }
            : post
        )
      );
    } catch (error) {
      console.log("Error liking/unliking post:", error.message);
    }
  };

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const response = await getDoc(docRef);
        const userData = response.data();
        fetchAllPost();
        setUser(userData);
        localStorage.setItem("social", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.clear();
      }
    });
    return () => subscribe();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        setUser,
        logout,
        fetchPost,
        profilePost,
        setProfilePost,
        post,
        fetchAllPost,
        likeUnlikePost,
        postLoading,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default MainContext;
