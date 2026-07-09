import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosHome } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { SlArrowLeft } from "react-icons/sl";
import { RiCoinFill } from "react-icons/ri";

const Dashboard = () => {
  const navigate = useNavigate();

  const [myToken, setMyToken] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const [peopleAhead, setPeopleAhead] = useState(0);
  const previousStatus = useRef(null);

  const logoutHandler = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const [serviceName, setServiceName] = useState("Hospital");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const fetchMyToken = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/my-token/${loggedInUser._id}`,
    );

    const latestToken = response.data.token;

    if (
      latestToken &&
      latestToken.status === "serving" &&
      previousStatus.current !== "serving"
    ) {
      toast.info("🎉 It's your turn! Please go to the counter.");
    }

    previousStatus.current = latestToken?.status;

    setMyToken(response.data.token);
    setPeopleAhead(response.data.peopleAhead);
  };

  useEffect(() => {
    fetchMyToken();

    const interval = setInterval(() => {
      fetchMyToken();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const bookTokenHandler = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/book-token`, {
      userId: loggedInUser._id,
      username: loggedInUser.username,
      serviceName,
    });

    console.log(response.data);

    if (response.data.token) {
      setMyToken(response.data.token);
      toast.success("Token booked successfully!");
    } else {
      alert(response.data.message);
    }

    fetchMyToken();
  };

  const cancelTokenHandler = async () => {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this token?",
    );

    if (!confirmCancel) {
      return;
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/cancel-token/${myToken._id}`,
    );

    console.log(response.data);
    toast.success("Token cancelled successfully!");

    setMyToken(null);
    fetchMyToken();
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden  lg:p-2">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white flex items-center justify-between px-4 z-40 border-b border-gray-800">
        <button
          className="text-4xl cursor-pointer text-gray-400 hover:text-white"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <GiHamburgerMenu />
        </button>

        <h1 className="font-bold text-2xl">QueueLess</h1>

        <div className="w-10"></div>
      </div>
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#1F2125] text-white flex flex-col justify-between rounded-r-xl transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:w-[20%] lg:h-full lg:rounded-xl`}
      >
        <div>
          <div className="flex justify-center m-5">
            <h1 className="hidden lg:block text-4xl font-bold">QueueLess</h1>
            <button
              className="text-gray-400 font-bold hover:text-white absolute top-5 right-5 lg:hidden"
              onClick={() => setShowSidebar(false)}
            >
              <SlArrowLeft />
            </button>
          </div>
          <div className="p-2 cursor-pointer flex flex-row gap-2 bg-[#01B173] hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] rounded-xl m-2 ">
            <IoIosHome className="h-7 w-7" />
            <h1 className="text-lg cursor-pointer ">Home</h1>
          </div>
        </div>
        <div className=" flex p-2 cursor-pointer flex-row hover:text-gray-300 text-gray-400 gap-2 m-2    ">
          <FiLogOut className="h-7 w-7 " />
          <button className="cursor-pointer text-xl  " onClick={logoutHandler}>
            Log out
          </button>
        </div>
      </div>

      <div className="flex-1 pt-16 lg:pt-0 overflow-hidden">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white px-4">
            Hi,
            <span className="text-2xl lg:text-4xl font-bold text-gray-400 ">
              {loggedInUser?.username}👋{" "}
            </span>
          </h1>
        </div>

        <div className="flex m-2 gap-3 p-4 flex-col rounded-xl text-white bg-[#1F2125] w-[calc(100%-1rem)] h-[calc(100vh-5rem)] overflow-hidden">
          <h1 className="text-xl lg:text-2xl font-bold mt-2 px-2">
            Select Service
          </h1>
          <select
            className="w-full p-2 border-2 border-cyan-950 cursor-pointer rounded-xl text-base lg:text-2xl text-black bg-gray-200"
            value={serviceName}
            onChange={(e) => {
              setServiceName(e.target.value);
            }}
          >
            <option>Hospital</option>
            <option>Bank</option>
            <option>Passport Office</option>
            <option>College Office</option>
          </select>
          <div>
            <button
              onClick={bookTokenHandler}
              className="bg-blue-500 active:scale-95 hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] cursor-pointer text-white w-full lg:w-auto px-6 py-2 rounded mt-5"
            >
              {" "}
              Book Token{" "}
            </button>
          </div>
          <h1 className="font-bold text-2xl mt-5 px-2">Your Booked Token</h1>
          {myToken ? (
            <div className=" p-4 w-[99%] border-2 flex flex-col items-center rounded-xl">
              <h2 className="text-xl lg:text-2xl font-bold">
                Token Booked Successfully ✅
              </h2>
              <div className="flex flex-col lg:flex-row w-full lg:justify-between gap-4 mt-5">
                <div>
                  <p className="text-sm lg:text-base">
                    Name: {myToken.username}
                  </p>
                  <p className="text-sm lg:text-base">
                    Service: {myToken.serviceName}
                  </p>
                  <p className="text-sm lg:text-base">
                    Token Number: {myToken.tokenNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm lg:text-base">
                    Status: {myToken.status.toUpperCase()}
                  </p>
                  <p className="text-sm lg:text-base">
                    People Ahead of you: {peopleAhead}
                  </p>
                </div>
              </div>
              {myToken.status === "waiting" && (
                <div className="flex w-full">
                  <button
                    onClick={cancelTokenHandler}
                    className="bg-red-500 active:scale-95 hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] text-white cursor-pointer w-full lg:w-auto px-6 py-2 rounded mt-3 "
                  >
                    Cancel Token
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 w-full border-2 rounded-xl flex flex-col justify-center items-center text-gray-400">
              <RiCoinFill className="text-9xl"/>
              <h2 className="text-2xl font-bold">No active token </h2> 
              <p className="text-lg">Select a service and book your first token</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
