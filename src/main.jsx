import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import MainContext from "./context/Store.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import Notification from "./pages/Notification.jsx";
import Create from "./pages/Create.jsx";
import EditProfile from "./pages/EditProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "notifications",
        element: <Notification />,
      },
      {
        path: "editProfile",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

createRoot(document.getElementById("root")).render(
  <MainContext>
    <RouterProvider router={router} />
  </MainContext>
);
