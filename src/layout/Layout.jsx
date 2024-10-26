import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Menu from "../components/Menu";

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div className="">
      <Menu />
      <div
        className={`no-scrollbar  ${
          pathname != "/" ? "" : "absolute h-full"
        } top-[50px] h-[100vh] pb-20 mx-1 overflow-y-scroll `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
