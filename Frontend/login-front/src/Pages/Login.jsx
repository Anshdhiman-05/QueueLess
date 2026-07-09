import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import bgImage from "../assets/bg.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email,
      password,
    });
    console.log(response.data);

    if (response.data.role === "admin") {
      localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      navigate("/admin");
    }
    else if (response.data.role === "user") {
      localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      navigate("/dashboard");
    }
    else {
      alert(response.data.message);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div
      className="flex min-h-screen bg-black w-full  bg-cover bg-center bg-no-repeat  justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="  w-[90%]  md:w-[500px] lg:w-180 min-h-[450px] lg:h-160 border-2 bg-black/30 backdrop-blur-sm  border-emerald-300 rounded-xl p-6 lg:p-10">
        <div className=" flex gap-10 p-6 lg:gap-20 lg:p-10  flex-col text-white items-center">
          <div className="font-bold">
            <h1 className="text-3xl lg:text-4xl">Login</h1>
          </div>
          <div className="flex flex-col gap-10 lg:gap-20 w-full items-center  ">
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="border-b-2 focus:outline-none w-full lg:w-100 px-4 py-2 text-base lg:text-xl  border-white"
              type="email"
              placeholder="Email"
            />
            <div className="relative w-full lg:w-100">
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                className="border-b-2 focus:outline-none w-full  pr-10 px-4 py-2 text-base lg:text-xl  border-white"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 cursor-pointer  mt-5 mr-2 "
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <button
            onClick={(e) => {
              submitHandler(e);
            }}
            className=" w-full lg:w-102 lg:text-base text-sm cursor-pointer active:scale-95 px-4 py-2 bg-blue-400 rounded-2xl"
          >
            Login
          </button>
          <p className="text-center text-sm lg:text-base">
            Don't have an account?
            <span
              onClick={() => navigate("/signin")}
              className="cursor-pointer text-blue-400 ml-1"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
