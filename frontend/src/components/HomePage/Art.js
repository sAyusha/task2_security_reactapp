import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
// import { getTimeDifference } from "../../utils/dateUtils";
import { TotalArtsContext } from "../../context/TotalArtsContext";

const Art = ({
  art,
  handleArtClick,
  fetchUserInfo,
  userInfo,
  activeTab,
  handleTabClick,
}) => {
  //   const { title, creator, imageUrl, user } = art;
  const { user, setUser } = useContext(UserContext);

  const { totalArts, updateTotalArts } = useContext(TotalArtsContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = (e) => {
    // e.stopPropagation();
    axios
      .delete(`https://localhost:3001/api/arts/${art.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Art deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
      });

    updateTotalArts(totalArts - 1);
  };

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

  // console.log(art);

  const isArtDatePassed = new Date(art?.endingDate) < new Date();

  return (
    <div className="mt-4 px-[2rem]">
      <div className="">
        <div
          className={`cursor-pointer relative w-full bg-dark-slate-85 dark:bg-black-75 rounded-xl transition duration-200 ${isArtDatePassed ? "" : "hover:scale-[1.01]"} `}
        >
          <div className="relative w-fit bg-light-slate dark:bg-black-75 rounded-lg flex flex-col transition duration-200 pb-4">
            <img
              src={`https://localhost:3001/uploads/${art.image}`}
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
                {user?.data[0].userType !== "admin" ? (
                  <>
                    <button className={`text-sm text-white flex items-center bg-blue-dark dark:bg-pink-light dark:border-light-color dark:text-black p-1 rounded-md vsm:px-3 ${isArtDatePassed ? "pointer-events-none" : ""}`}
                    onClick={() => {
                      if (art.artType === "Upcoming") {
                        handleTabClick("upcoming");
                      } else if (!isArtDatePassed) {
                        window.location.href = `/art-details/${art?._id || art?.id}`;
                      }
                    }}
                    >
                      BID NOW
                    </button>
                  </>

                ):(
                  <>
                    {/* <button className={`text-sm text-white flex items-center bg-blue-dark dark:bg-pink-light dark:border-light-color dark:text-black p-1 rounded-md vsm:px-3 ${isArtDatePassed ? "pointer-events-none" : ""}`}>
                      EDIT
                    </button> */}
                    <button className={`text-sm text-white flex items-center bg-blue-dark hover:bg-pale-red dark:bg-pink-light dark:border-light-color dark:text-black py-2 px-0 rounded-lg vsm:px-3 ${isArtDatePassed ? "pointer-events-none" : ""}`}
                    onClick={handleDeleteClick}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-sm font-medium vsm:text-base">
                {art?.creator}
              </p>
            </div>
          </div>
        </div>
      </div>
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
                Delete Art
              </p>

              <p className="text-sm text-black dark:text-white text-center">
                Are you sure you want to delete this art?
              </p>

              <div className="flex justify-center gap-6 mt-6">
                <button
                   onClick={() => {
                    handleConfirmDelete();
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
    </div>
  );
};

export default Art;
