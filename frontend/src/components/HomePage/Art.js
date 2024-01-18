import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
// import { getTimeDifference } from "../../utils/dateUtils";

const Art = ({
  art,
  handleArtClick,
  fetchUserInfo,
  userInfo,
  activeTab,
  handleTabClick,
}) => {
  //   const { title, creator, imageUrl, user } = art;
  const [isSaved, setIsSaved] = useState(false);
  const { user: currentUser, setUser } = useContext(UserContext);

  // const handleSavedClick = async (e) => {
  //   e.stopPropagation();

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       // Handle case when user is not logged in
  //       return;
  //     }

  //     if (isSaved) {
  //       // Remove saved arts
  //       await axios.delete(`http://localhost:3001/api/arts/save/${art._id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setUser((prevUser) => ({
  //         ...prevUser,
  //         savedPosts: prevUser.savedPosts.filter((artId) => artId !== art._id),
  //       }));
  //       setIsSaved(false);
  //     } else {
  //       // save arts
  //       await axios.post(
  //         `http://localhost:3001/api/arts/save/${art._id}`,
  //         null,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setUser((prevUser) => ({
  //         ...prevUser,
  //         savedPosts: [...prevUser.savedPosts, art._id],
  //       }));
  //       setIsSaved(true);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     // Handle error
  //   }
  // };

  function getTimeDifferenceString(dateString) {
    const targetDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = targetDate - currentDate;
    if (timeDifference < 0) {
      return "Date has passed";
    }

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const formattedTime = `${hours} hr ${minutes} min ${seconds} sec`;
    return formattedTime;
  }

  console.log(art);

  const isArtDatePassed = new Date(art?.endingDate) < new Date();

  return (
    <div className="mt-4 px-[2rem]">
      <div className="">
        <div
          className={`cursor-pointer relative w-full bg-dark-slate-85 dark:bg-black-75 rounded-xl transition duration-200 ${isArtDatePassed ? "" : "hover:scale-[1.01]"} `}
          onClick={() => {
            if (art.artType === "Upcoming") {
              handleTabClick("upcoming");
            } else if (!isArtDatePassed) {
              window.location.href = `/art-details/${art?._id || art?.id}`;
            }
          }}
        >
          <div className="relative w-fit bg-light-slate dark:bg-black-75 rounded-lg flex flex-col transition duration-200 pb-4">
            <img
              src={`http://localhost:3001/uploads/${art.image}`}
              alt="Art"
              className="border border-light-slate rounded-lg w-[500px] h-[250px] md:w-[500px] md:h-[250px] vsm:w-100vw vsm:h-100vh object-fill"
            />
            <div className="relative flex items-center h-[20px] right-[0.5rem] bottom-[2.3rem] justify-end z-10">
              <button className="text-sm text-white flex items-center gap-1 bg-[#262336ce] dark:bg-black-75 dark:border-black-75 px-2 py-1.5 rounded-md vsm:px-3 vsm:text-base">
                {getTimeDifferenceString(art?.endingDate)}
              </button>
            </div>
            <div className="flex flex-col justify-start px-2 gap-1">
              <p className="text-lg text-black font-semibold leading-[1.3] max-w-100vh text-ellipsis overflow-hidden dark:text-white">
                {art?.title}
              </p>

              <div className="flex flex-row justify-between">
                <p className="text-sm font-medium vsm:text-base">
                  {art?.startingBid}$
                </p>
                <button className={`text-sm text-white flex items-center bg-blue-dark dark:bg-pink-light dark:border-light-color dark:text-black p-1 rounded-md vsm:px-3 ${isArtDatePassed ? "pointer-events-none" : ""}`}>
                  BID NOW
                </button>
              </div>
              <p className="text-sm font-medium vsm:text-base">
                {art?.creator}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Art;
