import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { IoIosAdd, IoIosSearch } from "react-icons/io";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuItems = [
    {
      id: 1,
      title: "Home",
      path: "/",
      icon: <MdHome className="text-3xl" />,
    },
    {
      id: 2,
      title: "Search",
      path: "/search",
      icon: <IoIosSearch className="text-3xl" />,
    },
    {
      id: 3,
      title: "Post",
      path: "/create",
      icon: <IoIosAdd className="text-3xl" />,
    },
    ,
    // {
    //   id: 4,
    //   title: "Messages",
    //   path: "/messages",
    //   icon: <IoPaperPlaneOutline />,
    // },
    {
      id: 5,
      title: "Notifications",
      path: "/notifications",
      icon: <FaRegHeart className="text-2xl" />,
    },
    {
      id: 6,
      title: "Profile",
      path: "/profile",
      icon: <RxAvatar className="text-3xl" />,
    },
  ];

  return (
    <div className={`  w-full overflow-hidden `}>
      <div
        className={` ${
          pathname != "/" ? "hidden" : ""
        } absolute flex items-center justify-between w-full p-4`}
      >
        <FiCamera className="text-2xl" />
        <p className="font-bold text-pink-500">Social</p>
        <IoPaperPlaneOutline className="text-2xl" />
      </div>
      <hr
        className={` ${
          pathname != "/" ? "hidden" : ""
        } w-full border  absolute top-12`}
      />
      <div className=" bottom-0 p-2 left-0 grid grid-cols-5 w-full bg-white z-[999] fixed">
        <hr className="w-full border  absolute bottom-14" />
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="  flex items-center justify-center px-4 py-2 text-xl font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <p className="">{item.icon}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
