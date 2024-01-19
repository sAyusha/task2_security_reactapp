import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ArtDetails from "../components/HomePage/ArtDetails";
import HomePageBody from "../components/HomePage/HomePageBody";
import AddArtBody from "../components/PostArtPage/AddArtBody";
import ProfileBody from "../components/ProfilePage/ProfileBody";
import SearchBody from "../components/SearchPage/SearchBody";
import SettingsBody from "../components/Settings/SettingsBody";
import UpcomingBody from "../components/UpcomingPage/UpcomingBody";
import UpdatesBody from "../components/UpdatesPage/UpdatesBody";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { UserContext } from "../context/UserContext";
import Dashboard from "../components/Admin/Dashboard";

const MainPage = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("home");
  const [selectedArt, setSelectedArt] = useState(null);

  const [userInfo, setUserInfo] = useState(null);

  // Context
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.data[0]?.userType === "admin") {
      setActiveTab("dashboard");
    }
  }, [user]);

  // Handler functions
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedArt(null);
    localStorage.setItem("activeTab", tabName);
  };

  const handleArtClick = (art) => {
    setSelectedArt(art);
    setActiveTab("artDetails");
  };
  // Fetch user info on component mount
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // If token exists, fetch the user data
        const response = await axios.get(`http://localhost:3001/api/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } else {
        // If token doesn't exist, set user state to null
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
      setUserInfo(null); // Set user state to null in case of an error
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // // Fetch user info on component mount
  // const fetchUserInfo = async (userId) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3001/api/users/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     ); // Replace with your API endpoint for fetching user information
  //     if (response.status === 200) {
  //       const userData = response.data;
  //       setUserInfo(userData);
  //     } else {
  //       console.error("Failed to fetch user information");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user information:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserInfo();
  // }, []);

  // Render Loading if user info is not available
  // if (!userInfo) {
  //   return <div>Loading...</div>;
  // }

  // Configuration for different tabs
  const tabConfig = {
    home: {
      header: "Auctions",
      body: (
        <HomePageBody
          handleArtClick={handleArtClick}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
      ),
    },
    search: {
      header: "Search",
      body: (
        <SearchBody
          handleArtClick={handleArtClick}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
      ),
    },
    create: {
      header: "Post Your Art",
      body: (
        <AddArtBody
          handleArtClick={handleArtClick}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
    upcoming: {
      header: "Explore Upcoming",
      body: <UpcomingBody />,
    },
    updates: {
      header: "Updates",
      body: <UpdatesBody />,
    },
    profile: {
      header: "Profile",
      body: <ProfileBody
        userInfo={userInfo}
        fetchUserInfo={fetchUserInfo}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />,
    },
    settings: {
      body: <SettingsBody
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />,
    },
    artDetails: {
      header: "Art Details",
      body: (
        <ArtDetails
          art={selectedArt}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
    dashboard: {
      header: "Admin Dashboard",
      body: <Dashboard
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />,
    },
  };

  // Destructure the header and body based on the active tab
  const { header, body } = tabConfig[activeTab];

  return (
    <div className="flex w-full min-h-[100vh] bg-pink-lighter dark:bg-dark-bg">

      <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />

      <div className="flex flex-col justify-between text-black dark:text-white p-6 w-full md-2:mr-[280px] md-2:flex-1 md-2:relative md-2:py-0">
        <div>
          <Header
            currentPage={header}
            handleTabClick={handleTabClick}
          />
          {body}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
