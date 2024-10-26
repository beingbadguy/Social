import React, { useContext, useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { FirebaseContext } from "../context/Store";
import { IoIosArrowDown } from "react-icons/io";
import { RiGalleryView2 } from "react-icons/ri";
import { IoSaveOutline } from "react-icons/io5";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { CiLink } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";

const Profile = () => {
  const { user, profilePost, setProfilePost, fetchPost } =
    useContext(FirebaseContext);
  const navigate = useNavigate();
  const [seePost, setSeePost] = useState(true);
  const [hoveredPost, setHoveredPost] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPost(user);
    }
  }, [user]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-[100vh]">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
          {user?.username}
          <IoIosArrowDown className="mt-1" />
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
      {/* profile starts from here  */}
      <div className="mt-2 w-full">
        <div className="flex items-center justify-between gap-6 p-2 ">
          <img
            src={user?.profilePic}
            alt="user-profile"
            className="rounded-full h-24 w-24 border border-pink-500"
          />
          <div className="flex items-center gap-4 text-center ">
            <div>
              <p className="font-bold"> {user?.posts.length}</p>
              <p>Posts</p>
            </div>
            <div>
              <p className="font-bold"> {user?.followers.length}</p>
              <p>Followers</p>
            </div>
            <div>
              <p className="font-bold"> {user?.following.length}</p>
              <p>Following</p>
            </div>
          </div>
        </div>
        <p className="mt-2 font-bold m-3">{user?.name}</p>
        <p className="w-[80%] m-3">{user?.bio}</p>
        <div className="m-3 flex items-center justify-start gap-1">
          <CiLink />
          <a
            href={user?.website}
            target="_blank"
            className="italic text-gray-500"
          >
            {user?.website}
          </a>
        </div>
        <button
          className="flex items-center justify-center  bg-gray-200 text-black p-1 rounded  w-full  border border-gray-300 font-bold mt-4"
          onClick={() => {
            navigate("/editProfile");
          }}
        >
          Edit Profile
        </button>
      </div>
      <hr className="w-full mt-4" />
      <div className="flex  items-center justify-evenly  ">
        <div
          className={`${
            seePost ? "bg-gray-100" : ""
          }  w-[50%] flex items-center justify-center p-2 cursor-pointer`}
          onClick={() => {
            setSeePost(true);
          }}
        >
          <RiGalleryView2 className="text-3xl" />
        </div>
        <div
          className={`${
            seePost ? "" : "bg-gray-100"
          }  w-[50%] flex items-center justify-center p-2 cursor-pointer`}
          onClick={() => {
            setSeePost(false);
          }}
        >
          <IoSaveOutline className="text-3xl " />
        </div>
      </div>
      {/* <hr
        className={`${
          profilePost?.length > 0 ? "border-1 border-black w-[50%]" : ""
        }`}
      /> */}
      <div className="no-scrollbar grid grid-cols-2  gap-1 mt-[2px] h-[55vh]">
        {seePost
          ? profilePost?.map((p, i) => (
              <div key={i} className="relative">
                <img
                  src={p.postUrl}
                  alt=""
                  className={`  ${
                    hoverIndex === i ? "brightness-[0.3]" : ""
                  } hover:brightness-[0.3] cursor-pointer w-full h-full`}
                  onMouseEnter={() => {
                    setHoveredPost(true);
                    setHoverIndex(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredPost(false);
                    setHoverIndex(null);
                  }}
                />
                <div
                  className={`${
                    hoveredPost && hoverIndex === i ? "" : "hidden"
                  } absolute top-[40%] left-[43%]  cursor-pointer flex items-center justify-center text-white text-xl gap-2`}
                  onMouseEnter={() => {
                    setHoveredPost(true);
                    setHoverIndex(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredPost(false);
                    setHoverIndex(null);
                  }}
                >
                  <FaRegHeart /> {p.likes.length}
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Profile;
