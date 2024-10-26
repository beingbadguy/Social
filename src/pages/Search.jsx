import React, { useContext, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { FirebaseContext } from "../context/Store";
import Skel from "../components/skel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const Search = () => {
  const { user, post, postLoading } = useContext(FirebaseContext);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <div className="">
      <div className="flex justify-start bg-gray-200 rounded p-2 gap-2 items-center mt-1">
        <IoIosSearch size={24} />
        <input
          type="text"
          placeholder="Search"
          className="outline-none bg-transparent"
        />
      </div>
      <hr className="my-1" />
      {/* <Skel /> */}

      {postLoading ? (
        <div className="grid grid-cols-3 gap-2">
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
          <Skeleton width={200} height={300} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {post &&
            post?.map((p, i) => (
              <div key={i} className="">
                <img
                  src={p.postUrl}
                  alt=""
                  className="cursor-pointer hover:brightness-75"
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
