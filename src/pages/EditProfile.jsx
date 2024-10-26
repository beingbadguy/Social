import React, { useContext, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../context/Store";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";

const EditProfile = () => {
  const { user, setUser } = useContext(FirebaseContext);
//   console.log(user);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",

    website: user?.website || "",
  });
  const [userProfile, setUserProfile] = useState();
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const UpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const userDoc = doc(db, "users", user.user_id);

      // Upload profile picture if exists
      if (userProfile) {
        const storageRef = ref(storage, `profile/${userProfile.name}`);
        await uploadBytes(storageRef, userProfile);
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(userDoc, {
          name: userData?.name || "",
          bio: userData?.bio || "",
          website: userData?.website || "",
          profilePic: downloadURL || "",
        });
      } else {
        await updateDoc(userDoc, {
          name: userData?.name.length < 1 ? user?.name : userData?.name,
          bio: userData?.bio.slice(0, 150) || "",
          website: userData?.website || "",
        });
      }
      const updatedUser = await getDoc(userDoc);
      setUser(updatedUser.data());
      navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

//   console.log(userProfile);
  return (
    <div>
      <div className="flex items-center justify-between p-2">
        <div className="text-gray-500" onClick={() => navigate("/profile")}>
          Cancel
        </div>
        <div>Edit Profile</div>
        <div
          className="text-pink-500 font-bold"
          onClick={(e) => {
            UpdateProfile(e);
          }}
        >
          Done
        </div>
      </div>
      <div className="flex items-center justify-center flex-col">
        <div className="">
          <img
            src={user?.profilePic}
            alt="profile_pic"
            className="rounded-full h-32 w-32  border shadow-sm border-pink-200"
          />
        </div>
        <div
          className={` relative border-2 border-dotted flex items-center justify-center  rounded-full w-[10%] overflow-hidden  border-gray-500 h-[50px] mt-10 `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type.split("/")[0] === "image") {
                setUserProfile(file);
              } else {
                console.log("Please select a file that is an image.");
              }
            }}
            className="my-6 text-8xl opacity-0 z-[9999]"
          />
          <IoIosAdd className="absolute  text-xl text-gray-500 z-0" />
        </div>
        <form className="w-full mt-7 flex items-center justify-center flex-col  gap-2 ">
          <div className="flex items-start justify-evenly w-full flex-col ">
            <p>Name</p>
            <input
              type="text"
              name="name"
              value={userData?.name}
              onChange={handleChange}
              className="border border-pink-500 outline-none p-2 w-full rounded"
            />
          </div>
          <div className="flex items-start justify-evenly  w-full flex-col ">
            <p>Bio</p>
            <textarea
              type="text"
              name="bio"
              value={userData?.bio}
              onChange={handleChange}
              className="border rounded border-pink-500 outline-none p-2  w-full"
              placeholder="Enter bio here..."
              cols={25}
              rows="5"
            />
          </div>
          <div className="flex items-start justify-evenly w-full flex-col">
            <p>Website</p>
            <input
              type="text"
              name="website"
              value={userData?.website}
              onChange={handleChange}
              className="border rounded border-pink-500 outline-none p-2 w-full"
            />
          </div>
        </form>
      </div>
      <p className="mt-2 text-md text-pink-500 font-bold">
        Private Information
      </p>
      <div className="mt-2">
        <div className="grid grid-cols-2">
          Email <p>{user?.email}</p>
        </div>
        <div className="grid grid-cols-2">
          Username <p>{user?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
