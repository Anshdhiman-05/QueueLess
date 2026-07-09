import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import siImage from "../assets/sin.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate  =  useNavigate();

  const submitHandler= async (e)=>{
    e.preventDefault()
    
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`,{username: name,email,password});
    console.log(response.data)
    if (response.data.message === "Signup successful"){
      navigate("/");
    }

    setName("")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="flex min-h-screen bg-black w-full  bg-cover bg-center bg-no-repeat  justify-center items-center" style={{ backgroundImage: `url(${siImage})` }}>
          <div className="border-2 bg-black/30 backdrop-blur-sm  border-emerald-300 rounded-xl w-[90%] md:w-[500px] min-h-[450px] lg:w-180 lg:h-150 mt-10">
            <div className=" flex  gap-15 p-10  flex-col text-white items-center">
              <div className="font-bold">
                <h1 className="text-2xl lg:text-3xl">Sign in</h1>
              </div>
              <div className="flex flex-col gap-10 lg:gap-15 w-full items-center ">
                <input value={name} onChange={(e)=>{
                    setName(e.target.value)
                }} type="text" className="border-b-2 focus:outline-none w-full  lg:w-100 text-base lg:text-xl px-4 py-2 text-xl  border-white" placeholder="Enter your Name" />
                <input
                  value={email}
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}
                  className="border-b-2 focus:outline-none w-full  lg:w-100 text-base lg:text-xl px-4 py-2 text-xl  border-white"
                  type="email"
                  placeholder="Email"
                />
                <div className="relative w-full lg:w-100 ">
                  <input
                  value={password}
                  onChange={(e)=>{
                    setPassword(e.target.value)
                  }}
                  className="border-b-2 focus:outline-none w-full text-base lg:text-xl px-4 py-2   border-white"
                  type={showPassword ? "text":"password"}
                  placeholder="Password"
                />
                <button type="button" onClick={()=>
                    setShowPassword(!showPassword)
                } className="absolute right-0 cursor-pointer  mt-5 mr-2 ">{showPassword ? <FaEye />:<FaEyeSlash />}</button>
                </div>
                
              </div>
               <button onClick={(e)=>{
                submitHandler(e)
               }} className="lg:w-102 w-full text-sm lg:text-base  cursor-pointer active:scale-95 px-4 py-2 bg-orange-400 rounded-2xl">Sign in</button>
               <p className="text-center text-sm lg:text-base ">
                Already have an account?
                <span onClick={()=> navigate("/")} className="cursor-pointer text-blue-400 ml-1">
                    login
                </span>
               </p>
            </div>
          </div>
        </div>
  )
}

export default Signin