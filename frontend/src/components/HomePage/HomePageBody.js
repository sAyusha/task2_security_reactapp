import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FiArrowRightCircle } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";
import CategoriesBody from "./CategoriesBody";
import UpcomingArts from "./UpcomingArts";
import { useNavigate } from "react-router-dom";

const HomepageBody = ({
  handleArtClick,
  userInfo,
  fetchUserInfo,
  activeTab,
  handleTabClick,
}) => {
  const { user } = useContext(UserContext);
  const [arts, setArts] = useState([]);
  const navigate = useNavigate();

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

  // filter upcoming arts by artType
  const upcomingArts = arts.filter((art) => art.artType === "Upcoming");

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

  return (
    <div className="my-10  flex flex-col">
      <div className="flex items-center gap-2 font-medium vsm:gap-4">
        <div className="flex pb-[4rem] flex-row vsm:flex-col md:flex-row w-[75%] m-auto justify-center">
          <div className="flex flex-col gap-2 justify-center items-start w-[50%] vsm:w-[100%] pb-0 md:pb-0 vsm:pb-4 md:w-[50%]">
            <h3 className="laila">Featured Art</h3>
            <p className="text-medium md:block lg:block vsm:hidden text-black dark:text-dark-slate-85">
              Discover the most popular artworks, auctions and artists.
            </p>
            <div className="flex flex-row">
              <button className="text-sm text-white flex mr-2 items-center gap-1 bg-blue-dark dark:bg-pink-light dark:border-light-slate dark:text-black px-2 py-1.5 rounded-md vsm:px-3 vsm:text-base">
                {getTimeDifferenceString(arts[0]?.endingDate)}
              </button>
              <button
                className="text-sm flex items-center gap-2 px-2 py-1.5 rounded-md vsm:px-3 vsm:text-base"
                onClick={() => {
                  window.location.href = `/art-details/${arts[0]?.id}`;
                }}
              >
                Explore More
                <FiArrowRightCircle className="w-4 h-4 vsm:w-5 vsm:h-5 hover:text-lime-green" />
              </button>
            </div>
          </div>
          <img
            src={arts[0] && `http://localhost:3001/uploads/${arts[0].image}`}
            className="border border-light-slate w-[350px] h-[225px] object-cover rounded-lg"
            alt=""
          />
        </div>
      </div>

      <CategoriesBody
        handleArtClick={handleArtClick}
        userInfo={userInfo}
        fetchUserInfo={fetchUserInfo}
        arts={arts}
      />

      <div className="flex mt-6 flex-col px-[2rem] pb-[2rem]">
        <div className=" font-normal justify-between flex flex-row items-left">
          <h3 className="laila font-semibold">Upcoming Arts</h3>
          <button
            className="text-lg font-medium flex items-center gap-2 px-2 py-1.5 rounded-md vsm:px-3 vsm:text-base"
            onClick={() => {
              handleTabClick("upcoming");
            }}
          >
            View More
            <FiArrowRightCircle className="w-4 h-4 vsm:w-5 vsm:h-5 hover:text-lime-green" />
          </button>
        </div>
        <div className="flex flex-col">
          {upcomingArts.length === 0 && (
            <div className="mt-2">
              <p className="font-medium text-pale-red">
                No <span className="font-bold">upcoming arts</span> available.
              </p>
            </div>
          )}
          <div className="grid mt-2 gap-6 md:grid-cols-3 md:gap-8 2xl:grid-cols-3">
            {upcomingArts.map((art) => (
              <UpcomingArts
                key={art.id}
                art={art}
                handleArtClick={handleArtClick}
                fetchUserInfo={fetchUserInfo}
                userInfo={userInfo}
                activeTab={activeTab}
                handleTabClick={handleTabClick}
              />
            ))}
          </div>
          <hr className="mt-4 border-1 border-light-slate"></hr>
          <div className="flex justify-center items-center flex-col p-2 gap-2 mt-2">
            <h3 className="laila">Sell Your Own Artwork</h3>
            <p className="text-medium md:block lg:block vsm:hidden text-black dark:text-dark-slate-85">
              Let our experts find the best sales option for you to direct listing on Artalyst.
            </p>
            <button
              className="text-semibold bg-blue-dark text-white hover:bg-black-75 p-2 flex items-center gap-2 px-2 py-1.5 rounded-lg vsm:px-3 vsm:text-base"
              onClick={() => {
                if (user) {
                  handleTabClick("create");
                } else {
                  navigate("/please-login");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageBody;
