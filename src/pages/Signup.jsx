import React, { useContext, useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../context/Store";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Oval, RotatingLines } from "react-loader-spinner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { TiSocialInstagramCircular } from "react-icons/ti";

const Signup = () => {
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showpass, setShowpass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      setLoading(false);
      setError("Invalid email address");
      return;
    }
    if (
      formData.name === "" ||
      formData.username === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      setLoading(false);
      setError("Please enter all the required fields");
      return;
    }
    if (formData.password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters long");
      return;
    } else {
      try {
        setLoading(true);
        const response = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = response.user;
        if (user) {
          const collectionRef = doc(db, "users", user.uid);
          const docRef = await setDoc(collectionRef, {
            user_id: user.uid,
            name: formData.name,
            username: formData.username,
            email: formData.email,
            followers: [],
            following: [],
            posts: [],
            profilePic: "",
            bio: "",
            website: "",
            location: "",
            joinDate: new Date(),
            isPrivate: false,
            isVerified: false,
            isAdmin: false,
            isBanned: false,
            lastActive: new Date(),
            notifications: [],
            blockedUsers: [],
            reportedUsers: [],
          });
          // console.log(docRef);

          navigate("/");
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.log(error.message);
        if (error.message == "Firebase: Error (auth/email-already-in-use).") {
          setError("Email already in use");
        }
        setLoading(false);
      }
    }
    setLoading(false);
    // setError(null);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div
      className=" flex items-center justify-center flex-col h-[100vh]
    "
    >
      <TiSocialInstagramCircular className="text-6xl text-pink-500 my-2" />
      <h1 className="font-bold text-4xl">
        Social<span className="text-pink-500">Gram</span>
      </h1>
      <p className="font-bold">Hey, Welcome to the Signup Page</p>
      <form className="flex items-start justify-center flex-col my-2 border rounded shadow-sm p-4 w-[90%] md:w-[50%] lg:w-[40%]">
        <label>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 outline-pink-500 my-2 w-full rounded bg-slate-50"
          placeholder="Name"
        />
        <label>Username </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="border p-2 outline-pink-500 my-2 w-full rounded bg-slate-50"
          placeholder="Username"
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 outline-pink-500 my-2 w-full rounded bg-slate-50"
          placeholder="Email"
        />
        <label>Password:</label>
        <div className="relative w-full">
          <input
            type={showpass ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 outline-pink-500 my-2 w-full bg-slate-50 rounded"
            placeholder="Password"
          />
          <div
            className="absolute top-5 right-3 cursor-pointer"
            onClick={() => setShowpass(!showpass)}
          >
            {showpass ? <VscEye /> : <VscEyeClosed />}
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="border p-2 bg-pink-500 my-2 w-full rounded text-white font-bold hover:bg-pink-700 flex items-center justify-center"
          disabled={loading}
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          {loading ? (
            <RotatingLines
              visible={true}
              height="25"
              width="25"
              color="white"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "Create Account"
          )}
        </button>
        <div>
          Already have an account ?
          <span
            className="font-medium ml-2 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
