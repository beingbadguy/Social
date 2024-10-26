import React, { useContext } from "react";
import LogoutButton from "../components/LogoutButton";
import { FirebaseContext } from "../context/Store";
import { IoMdHeartEmpty } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import { CiTrophy } from "react-icons/ci";
import { IoHeart } from "react-icons/io5";
import Skel from "../components/skel";

const Home = () => {
  const { post, likeUnlikePost, user, likes, postLoading } =
    useContext(FirebaseContext);

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
    );
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div>
      <div className="">
        {postLoading ? (
          <div>
            <Skel />
            <Skel />
          </div>
        ) : (
          <div>
            {post?.map((p, i) => (
              <div key={i} className="border pb-2">
                <div className="flex items-center gap-2 p-2 justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={p.user.profilePic}
                      alt=""
                      className="border-2 border-pink-500 h-10 w-10 rounded-full"
                    />
                    <div>
                      <p>{p.user.name}</p>
                      <p>{p.user.username}</p>
                    </div>
                  </div>
                  <div className="text-xs">{formatTimestamp(p.timestamp)}</div>
                </div>

                <img src={p.postUrl} alt="" className="w-full" />
                <div className="flex items-center justify-between p-2">
                  <div>
                    <div>
                      {/* Use optional chaining to safely access likes[p.postID] */}
                      {likes?.[p.postID] ? (
                        <IoHeart
                          className="text-3xl cursor-pointer text-red-500"
                          onClick={() => {
                            likeUnlikePost(p.postID, user.user_id);

                            console.log(likes?.[p.postID]);
                          }}
                        />
                      ) : (
                        <IoMdHeartEmpty
                          className="text-3xl cursor-pointer "
                          onClick={() => {
                            likeUnlikePost(p.postID, user.user_id);
                            console.log(likes?.[p.postID]);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-2">Liked by {p.likes.length} people</p>
                <div className="flex gap-1 items-center ml-2">
                  <p className="font-bold">{p.user.username}</p>
                  <p>{p.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <div className="flex items-center justify-center">
        <p className="text-pink-500">Wow, You have reached the end</p>
        <CiTrophy className="text-xl text-yellow-500 font-bold" />
      </div> */}
    </div>
  );
};

export default Home;
