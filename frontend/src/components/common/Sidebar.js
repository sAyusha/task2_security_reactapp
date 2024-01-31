" use client ";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiBarChartSquare } from "react-icons/bi";
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";
import {
  MdAddCircleOutline,
  MdOutlineArrowBackIosNew,
  MdOutlineDashboard,
  MdOutlineExplore,
  MdOutlineHome,
  MdOutlineLightMode,
  MdOutlineSearch,
  MdOutlineSettings,
  MdOutlineBookmarkBorder
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { VscMenu } from "react-icons/vsc";
import { UserContext } from "../../context/UserContext";

const Sidebar = ({ activeTab, handleTabClick }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.theme || "light");

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);

  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [dropdownPosition2, setDropdownPosition2] = useState({ x: 0, y: 0 });

  const dropdownRef = useRef();
  const dropdownRef2 = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const openDropdown = (event) => {
    event.stopPropagation(); // Prevent click event from reaching the document level
    setIsSecondDropdownOpen(false); // Close the second dropdown if it's open

    // Calculate the position relative to the "More" button
    const moreButtonRect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = 200;

    setDropdownPosition({
      x: moreButtonRect.left,
      y: moreButtonRect.top - dropdownHeight,
    });
    setIsDropdownOpen(true);
  };

  const handleSwitchAppearanceClick = (event) => {
    event.stopPropagation(); // Prevent click event from reaching the document level
    setIsDropdownOpen(false); // Close the first dropdown

    // Use the same position calculated for dropdownPosition
    const switchButtonRect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = 300;

    // Calculate the position for the second dropdown (dropdownPosition2)
    setDropdownPosition2({
      x: switchButtonRect.left,
      y: switchButtonRect.top - dropdownHeight,
    });

    setIsSecondDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsSecondDropdownOpen(false);
  };

  const handleLogout = () => {
    // Clear the user authentication token from local storage
    localStorage.removeItem("token");

    // Navigate the user to the login page
    window.location.href = "/login";
  };

  return (
    <div className="fixed z-20 border-l border-light-slate bg-white dark:bg-dark-bg bottom-0 right-0 w-full md-2:bg-pink-lighter md-2:w-[280px] md-2:min-h-[100vh] md-2:flex md-2:flex-col md-2:justify-between md-2:py-5">
      <div className="md-2:flex md-2:flex-col md-2:gap-10">
        <div className="hidden md-2:block md-2:px-8">
          <h2
            className="noto-serif mb-2 md-2:block dark:text-white text-center"
            style={{ letterSpacing: "4px" }}
          >
            Artalyst
          </h2>
        </div>

        <nav className="w-full md-2:px-4">
          {/* <p className="hidden text-white opacity-75 mb-2 md-2:block md-2:ml-4">
            Navigation
          </p> */}

          <ul className="flex items-center justify-between px-6 py-4 border-t md-2:flex-col md-2:gap-2 md-2:items-start md-2:border-none md-2:p-0">
            {user?.data[0].userType === "admin" && (
              <li
                className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "dashboard"
                  ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                  : "text-black dark:text-white"
                  }`}
                onClick={() => handleTabClick("dashboard")}
              >
                <MdOutlineDashboard className="w-6 h-6" />
                <p className="hidden font-semibold md-2:block">Dashboard</p>

                {activeTab === "dashboard" && (
                  <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                )}
              </li>
            )}

            {user?.data[0].userType !== "admin" && (
              <>

                <li
                  className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "home"
                    ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                    : "text-black dark:text-white"
                    }`}
                  onClick={() => handleTabClick("home")}
                >
                  <MdOutlineHome className="w-6 h-6" />
                  <p className="hidden font-semibold md-2:block">Home</p>

                  {activeTab === "home" && (
                    <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                  )}
                </li>
              </>
            )}

            {user?.data[0].userType !== "admin" && (
              <>

                <li
                  className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "search"
                    ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                    : "text-black dark:text-white"
                    }`}
                  onClick={() => handleTabClick("search")}
                >
                  <MdOutlineSearch className="w-6 h-6" />
                  <p className="hidden font-semibold md-2:block">Search</p>

                  {activeTab === "search" && (
                    <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                  )}
                </li>
              </>
            )}

            {user?.data[0].userType !== "admin" && (
              <>
                <li
                  className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "upcoming"
                    ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                    : "text-black dark:text-white"
                    }`}
                  onClick={() => handleTabClick("upcoming")}
                >
                  <MdOutlineExplore className="w-6 h-6" />
                  <p className="hidden font-semibold md-2:block">
                    Explore Upcoming
                  </p>

                  {activeTab === "upcoming" && (
                    <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                  )}
                </li>
              </>
            )}

            {user?.data[0].userType === "admin" && (
              <>
                <li
                  className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "create"
                    ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                    : "text-black dark:text-white"
                    }`}
                  onClick={() => handleTabClick("create")}
                >
                  <MdAddCircleOutline className="w-6 h-6 dark:text-white" />
                  <p className="hidden font-semibold md-2:block">Create</p>

                  {activeTab === "create" && (
                    <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                  )}
                </li>
              </>
            )}

            {user?.data[0].userType !== "admin" && (
              <> <li
                className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "updates"
                  ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                  : "text-black dark:text-white"
                  }`}
                onClick={() => handleTabClick("updates")}
              >
                <BiBarChartSquare className="w-6 h-6" />
                <p className="hidden font-semibold md-2:block">Updates</p>

                {activeTab === "updates" && (
                  <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                )}
              </li>
              </>
            )}

            {user?.data[0].userType === "admin" && (
              <> <li
                className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "updates"
                  ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                  : "text-black dark:text-white"
                  }`}
                onClick={() => handleTabClick("settings")}
              >
                <MdOutlineSettings className="w-6 h-6" />
                <p className="hidden font-semibold md-2:block">Settings</p>

                {activeTab === "settings" && (
                  <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
                )}
              </li>
              </>
            )}

            <li
              className={`relative hover:text-blue-dark vsm:hover:dark:text-pink-light md-2:hover:dark:text-blue-dark cursor-pointer transition duration-200 ease-linear md-2:text-black md-2:flex md-2:items-center md-2:gap-3 md-2:w-full md-2:px-4 md-2:py-2.5 md-2:rounded-md-2 md-2:hover:bg-pink-light ${activeTab === "profile"
                ? "text-blue-dark vsm:dark:text-pink-light md-2:dark:text-blue-dark md-2:text-blue-dark md-2:bg-pink-light !impo"
                : "text-black dark:text-white"
                }`}
              onClick={() => {
                if (user) {
                  handleTabClick("profile");
                } else {
                  navigate("/please-login");
                }
              }}
            >
              <img
                src={
                  user?.data[0].profileImage
                    ? `https://localhost:3001/uploads/${user?.data[0].profileImage}`
                    : "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg"
                }
                alt=""
                className="w-8 h-8 rounded-full object-fill"
              />
              <p className="hidden font-semibold md-2:block">{user ? user?.data[0].username : "Guest User"}</p>

              {activeTab === "profile" && (
                <div className="md-2:bg-black vsm:dark:bg-pink md-2:dark:bg-white dark:w-[3px] h-full w-[2px] absolute left-0"></div>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <div
        ref={dropdownRef}
        className="hidden cursor-pointer md-2:flex items-center md-2:px-4 md-2:py-2 rounded-lg mx-4  transition duration-300 hover:bg-pink-light hover:dark:bg-blue-dark"
        onClick={(event) => openDropdown(event)}
      >
        <div>
          <VscMenu className="relative cursor-pointer z-20 text-black dark:text-white md-2:w-6 md-2:h-6 md-2:text-black transition duration-300 hover:text-blue-dark dark:hover:text-blue-dark" />
        </div>
        <div className="flex items-center text-black md-2:hover:text-blue-dark md-2:hover:dark:text-white dark:text-white md-2:text-black">
          <p className="font-semibold pl-5"> More</p>
        </div>
      </div>
      {isDropdownOpen && (
        <div
          className="fixed bg-pink-lighter dark:bg-black rounded-lg border border-light-slate shadow-xl py-2 mt-3"
          style={{
            top: dropdownPosition.y,
            left: dropdownPosition.x,
            zIndex: 100,
          }}
        >
          {user?.data[0].userType !== "admin" && (
            <>
              <div className="flex flex-row items-center mx-2 mb-1 px-4 py-2 text-black text-sm dark:text-white hover:bg-light-slate hover:dark:bg-blue-dark hover:rounded-md">
                <MdOutlineSettings className="w-4 h-4 mr-2" />
                <button
                  className="block flex-1 text-left"
                  onClick={() => {
                    if (user) {
                      handleTabClick("settings");
                    } else {
                      navigate("/please-login");
                    }
                    closeDropdown();
                  }}
                >
                  Settings
                </button>
              </div>
            </>
          )}

          <div
            ref={dropdownRef2}
            className="flex flex-row items-center mx-2 mb-1 px-4 py-2 text-sm text-black dark:text-white hover:bg-light-slate hover:dark:bg-blue-dark hover:rounded-md"
          >
            <MdOutlineLightMode className="w-5 h-5 mr-2" />
            <button
              className="block flex-1 text-left"
              onClick={(event) => {
                handleSwitchAppearanceClick(event);
              }}
            >
              Switch appearance
            </button>
          </div>

          {user?.data[0].userType !== "admin" && (
            <>
              <div
                className="flex flex-row items-center mx-2 mb-1 px-4 py-2 text-sm text-black dark:text-white hover:bg-light-slate hover:dark:bg-blue-dark hover:rounded-md"
                onClick={() => {
                  if (user) {
                    handleTabClick("profile");
                  } else {
                    navigate("/please-login");
                  } closeDropdown();
                }}
              >
                <MdOutlineBookmarkBorder className="w-4 h-4 mr-2" />
                <button
                  className="block flex-1 text-left"
                  onClick={() => {
                    if (user) {
                      handleTabClick("saved");
                    } else {
                      navigate("/please-login");
                    }
                    closeDropdown();
                  }}
                >
                  Saved
                </button>
              </div>
            </>
          )}

          <div className="border-t-2 border-light-slate"></div>

          <div className="flex flex-row items-center px-4 py-2 mx-2 mt-2 text-black dark:text-white hover:bg-light-slate hover:dark:bg-blue-dark hover:rounded-md">
            <button
              className="block flex-1 text-left"
              onClick={() => {
                handleLogout();
                closeDropdown();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {isSecondDropdownOpen && (
        // Second dropdown menu content with the "Switch Appearance" and "Dark Mode" options
        <div
          className="fixed bg-pink-lighter dark:bg-black rounded-lg border border-light-slate shadow-xl py-2 mt-3"
          style={{
            top: dropdownPosition2.y + 300,
            left: dropdownPosition2.x - 50,
            zIndex: 100,
          }}
        >
          <div className="flex flex-row items-center mx-1 mb-1 px-4 py-2 text-black text-sm dark:text-white w-60">
            <button>
              <MdOutlineArrowBackIosNew className="w-4 h-4 mr-2 text-light-color" />
            </button>
            <p className="block flex-1 text-left">Switch appearance</p>
            <MdOutlineLightMode className="w-4 h-4 ml-2" />
          </div>

          <div className="border-t-2 border-light-slate "></div>

          <div className="flex justify-between flex-row items-center mx-2 mt-2 mb-1 px-4 py-2 text-black text-sm dark:text-white hover:bg-light-slate hover:dark:bg-blue-dark hover:rounded-md">
            <button>Dark mode</button>

            <div className="flex border border-light-color">
              <button
                className={`p-2 ${theme === "light" ? "bg-black-75" : "bg-dark-bg"
                  } dark:bg-white dark:text-black text-pale-yellow`}
                onClick={handleThemeChange}
              >
                <BsFillSunFill className="w-3.5 h-3.5" />
              </button>
              <button
                className={`p-2 ${theme === "light" ? "bg-light-bg" : "bg-purple-lighter"
                  } text-black dark:text-pale-yellow`}
                onClick={handleThemeChange}
              >
                <BsMoonFill className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
