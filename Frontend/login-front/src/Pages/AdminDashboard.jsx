import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdAccountCircle } from "react-icons/md";
import { IoIosHome } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { SlArrowLeft } from "react-icons/sl";
import { PiMailboxDuotone } from "react-icons/pi";

const AdminDashboard = () => {
  const logoutHandler = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const [tokens, setTokens] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchTokens = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/tokens`);
    console.log(response.data);
    setTokens(response.data.tokens || []);
  };

  useEffect(() => {
    fetchTokens();

    const interval = setInterval(() => {
      fetchTokens();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const updateStatus = async (tokenId, status) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/token/${tokenId}`, {
      status,
    });
    console.log(response.data);
    fetchTokens();
  };
  const deleteToken = async (tokenId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this token?",
    );

    if (!confirmDelete) return;

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/token/${tokenId}`,
    );

    toast.success("Token deleted successfully!");

    console.log(response.data);

    fetchTokens();
  };

  const firstWaitingToken = tokens?.find((token) => token.status === "waiting");

  const waitingCount = tokens.filter(
    (token) => token.status === "waiting",
  ).length;

  const servingCount = tokens.filter(
    (token) => token.status === "serving",
  ).length;

  const completedCount = tokens.filter(
    (token) => token.status === "completed",
  ).length;

  const totalCount = tokens.length;

  return (
    <div className="flex h-screen overflow-hidden bg-black lg:p-2">
      <div className=" lg:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white flex items-center justify-between px-4 z-40 border-b border-gray-800">
        <button
          className="text-4xl cursor-pointer  text-gray-400 hover:text-white"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
        >
          <GiHamburgerMenu />
        </button>
        <h1 className="font-bold text-2xl">Queueless</h1>
        <div className="w-10"></div>
      </div>

      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#1F2125] text-white flex flex-col justify-between rounded-r-xl transform transition-transform duration-300
    ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:w-[20%] lg:h-full  lg:rounded-xl`}
      >
        <div>
          <div className="flex justify-center m-5">
            <h1 className=" hidden lg:block text-4xl font-bold">QueueLess</h1>
            <div className="flex justify-end">
              <button
                className=" text-gray-400 font-bold hover:text-white absolute top-5 mb-5 right-5  lg:hidden"
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              >
                {" "}
                <SlArrowLeft />{" "}
              </button>
            </div>
          </div>
          <div className="p-2 cursor-pointer flex flex-row gap-2 bg-[#01B173] hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] rounded-xl mt-6 mx-3">
            <IoIosHome className="h-7 w-7" />
            <h1 className="text-lg cursor-pointer ">Home</h1>
          </div>
        </div>
        <div className=" flex p-2 cursor-pointer hover:text-gray-300 text-gray-400 flex-row gap-2 m-2 text-black   ">
          <FiLogOut className="h-7 w-7 " />
          <button className="cursor-pointer text-xl " onClick={logoutHandler}>
            Log out
          </button>
        </div>
      </div>

      <div className="flex-1 pt-16 lg:pt-0 overflow-hidden">
        <h1 className="text-2xl lg:text-4xl text-gray-400 font-bold px-4">
          Hello Admin!
        </h1>
        <div className="flex m-2 gap-3 p-4 flex-col rounded-xl bg-[#1F2125] w-[calc(100%-1rem)] text-white h-[calc(100vh-5rem)]  overflow-hidden ">
          <h1 className="text-lg lg:text-xl font-bold">Overview</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className=" h-32 lg:h-50 flex flex-col bg-gradient-to-b from-blue-400 to-white text-black  items-center  justify-center rounded-xl ">
              <h2 className="text-sm lg:text-base">Waiting</h2>
              <p className="text-sm lg:text-base">{waitingCount}</p>
            </div>

            <div className="  h-32 lg:h-50 flex flex-col bg-gradient-to-b from-red-400 to-white text-black  items-center justify-center rounded-xl">
              <h2 className="text-sm lg:text-base">Serving</h2>
              <p className="text-sm lg:text-base">{servingCount}</p>
            </div>

            <div className=" h-32 lg:h-50 flex flex-col bg-gradient-to-b from-yellow-400 to-white text-black  items-center justify-center rounded-xl">
              <h2 className="text-sm lg:text-base">Completed</h2>
              <p className="text-sm lg:text-base">{completedCount}</p>
            </div>

            <div className=" h-32 lg:h-50 flex flex-col bg-gradient-to-b from-green-400 to-white text-black  items-center justify-center rounded-xl">
              <h2 className="text-sm lg:text-base">Total</h2>
              <p className="text-sm lg:text-base">{totalCount}</p>
            </div>
          </div>

          <h1 className="text-xl font-bold">All Tokens</h1>
          <div className=" flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto overflow-x-hidden hide-scrollbar pr-2">
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <div
                  className="border rounded-xl bg-black text-white  flex flex-col lg:flex-row lg:justify-between  w-full p-3  border-black gap-4"
                  key={token._id}
                >
                  <div className="flex flex-row  gap-8  lg:gap-10 w-full justify-between lg:justify-start">
                    <div className="flex flex-row items-center gap-6 lg:gap-10">
                      <MdAccountCircle className=" h-30 w-30 lg:h-20 lg:w-20 text-gray-400" />
                    </div>
                    <div className="flex flex-col  gap-1 ">
                      <h1 className="font-bold text-2xl lg:text-4xl ">
                        {token.username}
                      </h1>
                      <div className="flex flex-col lg:flex-row gap-2 lg:gap-50">
                        <p className="text-xs lg:text-base">
                          Service: {token.serviceName}
                        </p>
                        <p className="text-xs lg:text-base">
                          Token No: {token.tokenNumber}
                        </p>
                        <p className="text-xs lg:text-base">
                          Status: {token.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end w-full lg:w-auto lg:items-center">
                    {token.status === "waiting" &&
                      firstWaitingToken &&
                      token._id === firstWaitingToken._id && (
                        <button
                          className="border-bg-[#01B173] rounded-xl  cursor-pointer active:scale-90 px-4 py-2  bg-[#01B173] hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] whitespace-nowrap  "
                          onClick={() => updateStatus(token._id, "serving")}
                        >
                          Start Serving
                        </button>
                      )}
                    {token.status === "serving" && (
                      <button
                        className="border-bg-[#01B173] rounded-xl  cursor-pointer active:scale-90 px-4 py-2   bg-[#01B173] hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] whitespace-nowrap "
                        onClick={() => updateStatus(token._id, "completed")}
                      >
                        Complete
                      </button>
                    )}
                    {token.status === "completed" && (
                      <button
                        onClick={() => deleteToken(token._id)}
                        className="border rounded-xl  cursor-pointer active:scale-90  px-4 py-2  bg-red-500 hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] whitespace-nowrap "
                      >
                        Delete
                      </button>
                    )}
                    {token.status === "cancelled" && (
                      <button
                        onClick={() => deleteToken(token._id)}
                        className="border rounded-xl  cursor-pointer active:scale-90 px-4 py-2   bg-red-500 hover:shadow-[0_0_25px_rgba(1,177,115,0.45)] whitespace-nowrap "
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col border-2 rounded-xl  justify-center items-center p-10 h-full text-gray-400">
                <h1 className="text-xl font-bold">Not a Single Token Booked</h1>
                <PiMailboxDuotone className="text-9xl"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
