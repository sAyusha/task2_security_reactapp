" use client ";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
// import { TotalArtsContext } from "../../context/TotalArtsContext";
import { UserContext } from "../../context/UserContext";

const UserInfo = ({ myArts }) => {
  const { user, setUser } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const [error, setError] = useState(null); // AddedState variable to store the total number of books
  const fileInputRef = useRef(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
    setError(null); // Reset the error message when selecting a new profile picture
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      return;
    }

    const formData = new FormData();
    formData.append("uploadPictures", profilePicture);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/uploadProfilePicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { filename } = response.data;

      // Update the user's profile picture in the user context
      setUser((prevUser) => ({
        ...prevUser,
        profileImage: filename,
      }));

      setIsImageUploaded(true);
    } catch (error) {
      console.log(error);
      setError("Failed to upload profile picture."); // Set the error message in case of an error
    }
  };

  useEffect(() => {
    if (user) {
      console.log("fetch users:", user);
      console.log("fetch users:", user.username);
    }
    if (profilePicture) {
      console.log("fetch users:", user.profileImage);
      setIsImageUploaded(false);
    }
  }, [profilePicture]);

  return (
    <div className="text-black dark:text-dark-slate-85 flex flex-row text-center md:gap-[6rem] vsm:gap-[2rem] w-[100%] md-2:text-start md:ml-[4rem] vsm:ml-0 md:mb-10 mb-16 vsm:mb-10">
      <div className="flex flex-col flex-wrap">
      <div className="relative w-fit">
        <img
          src={
            user?.data && user?.data[0]?.profileImage
              ? `http://localhost:3001/uploads/${user?.data[0]?.profileImage}`
              : "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg"
          }
          alt=""
          className="border border-light-slate w-[250px] h-[200px] md:w-[250px] vsm:min-w-[150px] rounded-[50%] object-fill"
        />

        <div
          className="relative flex items-center justify-center cursor-pointer right-[0.5rem] bottom-[15px] vsm:right-[-6.5rem] vsm:bottom-[40px] md:right-[-11rem] md:bottom-[40px] text-black bg-pink-light-hover w-8 h-8 rounded-full hover:bg-blue-dark hover:text-white transition duration-200"
          onClick={openFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleProfilePictureChange}
            className="invisible relative z-40 w-full h-full"
          />

          <IoMdAdd className="absolute w-[50%] h-[50%]" />
        </div>
      </div>

      {error && <p className="text-pale-red mt-2">{error}</p>}

      {profilePicture && !isImageUploaded && (
        <div className="w-full flex justify-center mt-2">
          <button
            className="self-center text-black dark:text-white flex items-center gap-1.5 px-4 py-1.5 border border-light-slate transition duration-200 ease-linear hover:bg-pink-light-hover hover:text-black md-2:self-start"
            onClick={uploadProfilePicture}
          >
            <p className="font-semibold">Upload Picture</p>
          </button>
        </div>
      )}
      </div>

      <div className="flex flex-col gap-3 justify-center">
        <div className="flex flex-row gap-4 mt-[1rem] md:mt-[1rem] vsm:mt-0">
          {/* <p className="text-xl text-black font-semibold">{user.username}</p> */}
          <p className="text-[20px] text-black font-semibold dark:text-white">
            {user?.data && user?.data[0]?.username}
          </p>
          <button
            className="font-semibold bg-light-slate hover:font-bold text-sm rounded-[8px] h-[2rem] vsm:px-2 vsm:min-w-[100px] dark:bg-blue-dark"
            onClick={() => handleTabClick("settings")}
          >
            Edit Profile
          </button>
        </div>
        <div className="flex flex-row vsm:flex-col md:flex-row gap-4 md:gap-4 vsm:gap-0">
          <div className="flex justify-between md:justify-between vsm:justify-start items-center gap-1 vsm:gap-4 md-2:gap-1">
            <div className="text-black dark:text-white font-semibold px-1 py-1 text-[20px]">
              {
                myArts.length
              }
            </div>
            <p className="text-[20px] font-medium">Posts</p>
          </div>

          <div className="flex justify-between md:justify-between vsm:justify-start items-center gap-1 vsm:gap-4 md-2:gap-1">
            <div className="md:text-black dark:text-white font-semibold px-1 py-1 text-[20px]">
              {user?.data[0]?.followers?.length}
            </div>
            <p className="text-[20px] font-medium">Followers</p>
          </div>

          <div className="flex justify-between md:justify-between vsm:justify-start items-center gap-1  vsm:gap-4 md-2:gap-1">
            <div className="text-black dark:text-white font-semibold px-1 py-1 text-[20px]">
              {user?.data[0]?.followingArtists?.length}
            </div>
            <p className="text-[20px] font-medium">Following</p>
          </div>
        </div>
        <div className="md:mt-0 md:ml-0 mt-0 ml-0 md:w-[75%] md:py-2 vsm:pr-0">
          {user?.data[0]?.bio && (
            <p className="text-[15px] text-left text-ellipsis">
              {user?.data[0]?.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
