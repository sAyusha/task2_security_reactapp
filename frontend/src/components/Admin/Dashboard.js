import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsCheckLg, BsClock, BsFileEarmarkPost } from "react-icons/bs";
import { FaExchangeAlt, FaUserFriends, FaRegCalendarCheck, FaRegClock } from "react-icons/fa";
import { IoBookSharp, IoClose, IoHappyOutline, IoSadOutline } from "react-icons/io5";
import { MdOutlinePending, MdOutlineUpdate } from "react-icons/md";
import { RiAuctionFill, RiBarChartBoxFill } from "react-icons/ri";
import Art from "../HomePage/Art";

const Dashboard = ({ activeTab, handleTabClick }) => {
  const [dashboardSummary, setDashboardSummary] = useState({
    totalUsers: 0,
    totalArts: 0,
    totalBid: 0,
    totalOrder: 0,
    pendingBidStatus: 0,
    winningBidStatus: 0,
    losingBidStatus: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [arts, setArts] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setIsHovered(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    axios
      // .get("http://localhost:3001/api/arts/others", {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // })
      .get("http://localhost:3001/api/arts", {})
      .then((res) => {
        setArts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // Fetch dashboard summary data when the component mounts
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3001/api/admin/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:3001/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3001/api/admin/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://localhost:3001/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // You may want to refresh the user data after deletion
      fetchUsers();

      // reload page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 py-5">
        <h2 className="text-3xl mt-4 font-bold text-blue-dark dark:text-white">Summary</h2>
        <hr className="border-1 border-light-slate mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-2">
          <div className="bg-white h-[150px] shadow-lg rounded-xl justify-between p-3 text-black font-medium group">
            <div className="flex justify-between">
              <div className="flex relative bottom-[25px] justify-center items-center w-16 h-16 bg-dark-slate rounded-xl transition-all duration-300 transform group-hover:rotate-12">
                <FaUserFriends className="w-6 h-6 text-white" />
              </div>
              <div className="text-right text-md text-dark-slate">
                <p>Total Users</p>
                <p className="text-3xl font-bold text-blue-dark">{dashboardSummary.totalUsers}</p>
              </div>
            </div>
            <hr className="border-1 border-light-slate mt-4" />
            <div className="text-md flex text-dark-slate pt-4">
              <MdOutlineUpdate className="w-5 h-5" />
              <p className="text-dark-slate pl-2 text-sm">Updated Now</p>
            </div>
          </div>

          <div className="bg-white h-[150px] dark:bg-light-slate shadow-lg rounded-xl justify-between p-3 text-black font-medium group">
            <div className="flex justify-between">
              <div className="flex relative bottom-[25px] justify-center items-center w-16 h-16 bg-blue rounded-xl transition-all duration-300 transform group-hover:rotate-12">
                <BsFileEarmarkPost className="w-6 h-6 text-white" />
              </div>
              <div className="text-right text-md text-dark-slate">
                <p>Total Arts</p>
                <p className="text-3xl font-bold text-blue-dark">{dashboardSummary.totalArts}</p>
              </div>
            </div>
            <hr className="border-1 border-light-slate mt-4" />
            <div className="text-md flex text-dark-slate pt-3 justify-between">
              <div className="flex pt-1">
                <FaRegCalendarCheck className="w-5 h-5" />
                <p className="text-dark-slate pl-2 text-sm">Last day</p>
              </div>
              <div>
                <button className="bg-blue hover:bg-blue-dark py-1 px-2 rounded-lg text-white text-sm" onClick={() => handleTabClick("profile")}>View Art</button>
              </div>
            </div>
          </div>

          <div className="bg-white h-[150px] dark:bg-light-slate shadow-lg rounded-xl justify-between p-3 text-black font-medium group">
            <div className="flex justify-between">
              <div className="flex relative bottom-[25px] justify-center items-center w-16 h-16 bg-pale-green rounded-xl transition-all duration-300 transform group-hover:rotate-12">
                <RiAuctionFill className="w-7 h-7 text-white" />
              </div>
              <div className="text-right text-md text-dark-slate">
                <p>Total Bidding</p>
                <p className="text-3xl font-bold text-blue-dark">{dashboardSummary.totalBid}</p>
              </div>
            </div>
            <hr className="border-1 border-light-slate mt-4" />
            <div className="text-md flex text-dark-slate pt-4">
              <MdOutlineUpdate className="w-5 h-5" />
              <p className="text-dark-slate pl-2 text-sm">Updated Now</p>
            </div>
          </div>

          <div className="bg-white h-[150px] dark:bg-light-slate shadow-lg rounded-xl justify-between p-3 text-black font-medium group">
            <div className="flex justify-between">
              <div className="flex relative bottom-[25px] justify-center items-center w-16 h-16 bg-purple-lighter-black-20 rounded-xl transition-all duration-300 transform group-hover:rotate-12">
                <RiBarChartBoxFill className="w-7 h-7 text-white" />
              </div>
              <div className="text-right text-md text-dark-slate">
                <p>Total Orders</p>
                <p className="text-3xl font-bold text-blue-dark">{dashboardSummary.totalOrder}</p>
              </div>
            </div>
            <hr className="border-1 border-light-slate mt-4" />
            <div className="text-md flex text-dark-slate pt-4">
              <FaRegClock className="w-5 h-5" />
              <p className="text-dark-slate pl-2 text-sm">In the last hour</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-2">
          <div className="bg-purple-lighter-white-80 rounded-lg flex items-center justify-between p-3 border-b-4 border-dark-slate text-black font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <MdOutlinePending className="w-5 h-5" />
            </div>
            <div className="text-right text-dark-slate">
              <p>Pending Bid Status</p>
              <p className="text-2xl font-semibold text-blue-dark">{dashboardSummary.pendingBidStatus}</p>
            </div>
          </div>

          <div className="bg-purple-lighter-white-80 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-dark-slate text-black font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <IoHappyOutline className="w-5 h-5" />
            </div>
            <div className="text-right text-dark-slate">
              <p>Winning Bid Status</p>
              <p className="text-2xl font-semibold text-blue-dark">
                {dashboardSummary.winningBidStatus}
              </p>
            </div>
          </div>

          <div className="bg-purple-lighter-white-80 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-dark-slate text-black font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <IoSadOutline className="w-5 h-5" />
            </div>
            <div className="text-right text-dark-slate">
              <p>Losing Bid Status</p>
              <p className="text-2xl font-semibold text-blue-dark">
                {dashboardSummary.losingBidStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Display a table of users */}
        {users.length > 0 && (
          <div className="bg-white p-4 shadow-lg rounded-xl mt-4">
            <h2 className="text-2xl font-bold text-black-75 mb-2">User list</h2>
            <table className="min-w-full">
              <tbody>
                {users.map((user, index) => (
                  <React.Fragment key={user.id}>
                    {/* User Info Row */}
                    <tr>
                      <td className="border-b border-light-slate px-4 py-2">
                        <div className="flex flex-col">
                          <p className="text-dark-slate">user:
                            <span className="text-black font-semibold pl-2">{user.fullname}</span>
                          </p>
                        </div>
                      </td>
                      <td className="border-b border-light-slate px-4 py-2">
                        <div className="flex flex-col">
                          <p className="text-dark-slate">username:
                            <span className="text-black font-semibold pl-2">{user.username}</span>
                          </p>
                        </div>
                      </td>
                      <td className="border-b border-light-slate px-4 py-2">
                        <div className="flex flex-col">
                          {user.userType === "admin" ? (
                            <button
                              className="bg-pale-red text-white p-1 rounded-lg cursor-not-allowed"
                              disabled
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              className="bg-pale-red text-white p-1 rounded-lg"
                              // onClick={() => handleDeleteUser(user.id)}
                              onClick={handleDeleteClick}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isDeleteModalOpen && (
                      <div className="bg-[#000000cb] text-white fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
                        {/* Delete confirmation modal */}
                        <div className="modal relative w-full max-w-2xl overflow-auto">
                          <div className="relative py-10 mx-5 bg-light-color p-4 rounded-xl shadow dark:bg-blue-dark">
                            <button className="absolute top-3 right-4">
                              <IoClose
                                onClick={handleCloseDeleteModal}
                                className="w-7 h-7 dark:text-white text-black transition duration-300"
                              />
                            </button>

                            <p className="text-2xl dark:text-white text-black font-medium text-center mb-4">
                              Delete User
                            </p>

                            <p className="text-sm text-black dark:text-white text-center">
                              Are you sure you want to delete this user?
                            </p>

                            <div className="flex justify-center gap-6 mt-6">
                              <button
                                onClick={() => {
                                  handleDeleteUser(user.id);
                                  handleCloseDeleteModal();
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-dark text-white hover:text-lime-green hover:bg-black-75 text-base font-medium transition duration-300"
                              >
                                Delete
                              </button>

                              <button
                                onClick={handleCloseDeleteModal}
                                className="px-4 py-2 rounded-lg bg-blue-dark text-white text-base font-medium transition duration-300 hover:text-pale-red hover:bg-light-slate"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add a transparent row for spacing */}
                    {index !== users.length - 1 && (
                      <tr>
                        <td className="border-t border-light-slate px-4 py-2 text-center"></td>
                        <td className="border-t border-light-slate px-4 py-2 text-center"></td>
                        <td className="border-t border-light-slate px-4 py-2 text-center"></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-black-75 text-center">Art list</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {arts.map((arts, index) => (
              <Art key={index} art={arts} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
