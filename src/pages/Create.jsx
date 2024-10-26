import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../config/firebase";
import { FirebaseContext } from "../context/Store";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { RotatingLines } from "react-loader-spinner";

const Create = () => {
  const { user, fetchPost, fetchAllPost } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isError, setIsError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (!postImage || !content) {
      console.log("Please select an image and write a caption to post");
      setIsError("Please select an image and write a caption to post");
      setLoader(false);

      return;
    } else {
      try {
        const storageRef = ref(storage, `posts/${postImage.name}`);

        // Upload the image
        await uploadBytes(storageRef, postImage);

        // Get the download URL
        const imageUrl = await getDownloadURL(storageRef);

        // make sure to add saved by
        const newPost = {
          content: content,
          postUrl: imageUrl,
          userId: user.user_id,
          timestamp: new Date(),
          likes: [],
          comments: [],
        };

        const docRef = collection(db, "posts");
        const post = await addDoc(docRef, newPost);
        // console.log(post.data);

        const userPostRef = doc(db, "users", user?.user_id);
        await updateDoc(userPostRef, {
          posts: arrayUnion(post.id),
        });
        const updatedUser = { ...user, posts: [...user.posts, post.id] };
        setTimeout(async () => {
          await fetchPost(updatedUser);
          setIsError("");
          setLoader(false);
          navigate(`/`);
          fetchAllPost();
        }, 1000);
      } catch (error) {
        console.log(error.message);
        setIsError("An error occurred while creating the post");
        setLoader(false);
      }
    }
  };

  return (
    <div>
      <div className="pt-2">
        <MdKeyboardArrowLeft
          className="text-3xl cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>
      <h1 className="p-2 font-bold text-4xl ">Create Post</h1>
      <div className="flex items-center justify-center w-full">
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Preview"
            className=" h-[250px] rounded mt-10 "
          />
        )}
      </div>
      <form className="mt-10" onSubmit={handleSubmit}>
        <div
          className={` ${
            postImage ? "hidden" : ""
          } relative border-2 border-dotted flex items-center text-center h-[100px] rounded-full w-full border-gray-500`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type.split("/")[0] === "image") {
                if (photoUrl) {
                  URL.revokeObjectURL(photoUrl);
                }
                setPostImage(file);
                setPhotoUrl(URL.createObjectURL(file));
              } else {
                console.log("Please select a file that is an image.");
              }
            }}
            className="my-6 text-8xl opacity-0 z-[9999]"
          />
          <FaRegFileImage className="absolute left-[47%] text-4xl text-gray-500 z-0" />
        </div>
        <textarea
          placeholder="Caption.."
          cols="20"
          rows="5"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="w-full p-2 border border-gray-500 outline-pink-500 mt-10 rounded"
        />
        <div className="flex items-center justify-between p-2">
          <button
            type="button"
            className="bg-black text-white p-2 rounded"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black text-white p-2 rounded flex justify-center items-center"
          >
            {loader ? (
              <RotatingLines
                visible={true}
                height="25"
                width="25"
                color="#f43f5e"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>
      {isError && <p className="text-red-500 mt-2">{isError}</p>}
    </div>
  );
};

export default Create;
