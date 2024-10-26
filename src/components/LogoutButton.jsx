import React, { useContext } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { FirebaseContext } from "../context/Store";

const LogoutButton = () => {
  const { logout } = useContext(FirebaseContext);
  return (
    <div
      className="flex items-center justify-center text-black  w-[20px] cursor-pointer"
      onClick={() => {
        logout();
      }}
    >
      <AiOutlineLogout className="text-2xl" />
    </div>
  );
};

export default LogoutButton;
