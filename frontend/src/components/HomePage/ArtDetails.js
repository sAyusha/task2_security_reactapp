import React, { useContext, useEffect, useRef, useState } from "react";
import { BiMinus, BiPlus, BiZoomIn } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaArrowCircleLeft } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import AddressModal from "../OrderModal/AddressModal";
import ImageModal from "../common/ImageModal";

const ArtDetails = ({ userInfo, fetchUserInfo, art }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [artDetail, setArtDetail] = useState({});
  const [artOwner, setArtOwner] = useState({});
  const { user: currentUser, setUser } = useContext(UserContext);

  const [amount, setAmount] = useState(0);
  const imageRef = useRef(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredBids, setFilteredBids] = useState([]);
  const [usersInfo, setUsersInfo] = useState();
  const [userData, setUserData] = useState({});

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/api/users/${art?.user}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((res) => {
  //       setArtOwner(res.data.data);
  //       setIsSaved(res.data.data[0].savedArts.includes(artId));
  //       console.log(res.data.data[0]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [artDetail]);

  
  const { artId } = useParams();
  
  useEffect(() => {
    if (currentUser) {
      setIsSaved(currentUser?.data[0].savedArts.includes(artId));
    }
  }, [currentUser, artId]);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/arts/${artId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setArtDetail(res.data.data);
        setAmount(res.data.data[0]?.startingBid);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [artId]);

  const handleZoomIn = () => {
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handleMakeBid = () => {
    setIsModalOpen(true);
  };

  const handleMouseMove = (e) => {
    const imageElement = imageRef.current;
    const { clientX, clientY } = e;
    const { left, top, width, height } = imageElement.getBoundingClientRect();

    const xPercent = ((clientX - left) / width) * 100;
    const yPercent = ((clientY - top) / height) * 100;

    imageElement.style.objectPosition = `${xPercent}% ${yPercent}%`;
  };

  const handleMouseOut = () => {
    const imageElement = imageRef.current;
    imageElement.style.objectPosition = "center";
  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.textContent);
    if (!isNaN(newAmount)) {
      setAmount(newAmount);
    }
  };

  const handleDecrease = () => {
    setAmount((prevAmount) => prevAmount - 1);
  };

  const handleIncrease = () => {
    setAmount((prevAmount) => prevAmount + 1);
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

  // const handleSave = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       return;
  //     } else {
  //       if (isSaved) {
  //         await axios.delete(`http://localhost:3001/api/arts/save/${artId}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         setIsSaved(false);
  //       } else {
  //         await axios.post(
  //           `http://localhost:3001/api/arts/save/${artId}`,
  //           null,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         setIsSaved(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSave = async (e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle case when user is not logged in
        return;
      }

      if (isSaved) {
        // Remove saved arts
        await axios.delete(`http://localhost:3001/api/arts/save/${artId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser((prevUser) => {
          const updatedSavedArts =
            prevUser?.data[0].savedArts.filter(
              (artId) => artId !== artId
            );
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                savedArts: updatedSavedArts,
              },
            ],
          };
        });
        setIsSaved(false);
      } else {
        // Save the artpost
        await axios.post(
          `http://localhost:3001/api/arts/save/${artId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => {
          const updatedSavedArts = [
            ...prevUser?.data[0].savedArts,
            artId,
          ];
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                savedArts: updatedSavedArts,
              },
            ],
          };
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  useEffect(() => {
    const fetchBidsAndUserInfo = async () => {
      try {
        const bidsResponse = await axios.get("http://localhost:3001/api/bids", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const usersInfoResponse = await axios.get(
          "http://localhost:3001/api/users/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const bidsData = bidsResponse.data.data;
        const usersInfoData = usersInfoResponse.data.data;

        console.log(usersInfoData);

        // Filter bids for the current art
        const filteredBidsData = bidsData.filter((bid) => {
          return bid.bidArt.includes(artId);
        });

        filteredBidsData.sort((a, b) => b.bidAmount - a.bidAmount);

        // Create a user info object using the user IDs
        const usersInfoObject = {};
        usersInfoData.forEach((user) => {
          usersInfoObject[user.id] = user;
        });

        setUserData(usersInfoObject);

        console.log(usersInfoObject);

        setFilteredBids(filteredBidsData);
         // Log the filtered bid data
      console.log("Filtered Bids:", filteredBidsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBidsAndUserInfo();
  }, [artId]);

  const handleBid = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      } else if (artDetail[0]?.user === currentUser.data[0]?.id) {
        setErrorMessage("You can't bid on your own art");
        setIsLoading(false);
      } else {
        await axios.post(
          `http://localhost:3001/api/bids/${artId}/bid`,
          {
            bidAmount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLoading(false);
        setIsModalOpen(true);
        setErrorMessage("");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="w-full mb-4 ">
      <button
        className="fixed top-4 left-4 z-40 cursor-pointer"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <FaArrowCircleLeft className="w-8 h-8" />
      </button>

      <header className="relative flex justify-center left-0 md:pt-4 vsm:items-center md:items-center">
        <div className="flex flex-col items-center sm:flex-col sm:flex-grow">
          <h2
            className="noto-serif leading-tight w-full md:w-full vsm:w-[300px] text-[34px] font-semibold text-center"
            style={{ letterSpacing: "2px", textTransform: "uppercase" }}
          >
            {getTimeDifferenceString(artDetail[0]?.endingDate)}
          </h2>
          <div className="grid grid-cols-3 gap-1 w-[25%] vsm:w-[78%] md:w-[23%]">
            <p className="text-sm text-center text-black font-light leading-[1.3] dark:text-white">
              hours
            </p>
            <p className="text-sm text-center text-black font-light leading-[1.3] dark:text-white">
              minutes
            </p>
            <p className="text-sm text-center text-black font-light leading-[1.3] dark:text-white">
              seconds
            </p>
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-10 vsm:mt-5 p-0 md:p-0 vsm:p-4 justify-center items-start vsm:mb-0 mb-16 flex flex-col gap-6 md:flex-row md:gap-8 md-2:mb-5">
        <div className="min-w-fit relative m-0 md:m-0 vsm:m-auto">
          <img
            src={`http://localhost:3001/uploads/${artDetail[0]?.image}`}
            alt=""
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
            className="border border-light-slate rounded-t-lg object-cover w-[325px] h-[325px]"
          />

          <div className="flex flex-row gap-4 rounded-b-lg text-lg bg-pink-light py-1 px-2">
            <RiAuctionLine className="w-6 h-6" />
            <p className="font-semibold">{artDetail[0]?.startingBid}$</p>
          </div>

          <div className="absolute bottom-[2.5rem] right-[0.5rem]">
            <button
              className="hover:bg-blue-dark bg-light-bg rounded-full p-[0.4rem] hover:rounded-full hover:text-white"
              onClick={handleZoomIn}
            >
              <BiZoomIn className="w-6 h-6" />
            </button>
          </div>
          {/* Render the modal if it's open */}
          {isImageModalOpen && (
            <ImageModal
              imageUrl={`http://localhost:3001/uploads/${artDetail[0]?.image}`}
              onClose={handleImageModalClose}
            />
          )}
        </div>

        <div className="flex flex-col justify-center items-center gap-8 w-[50%] md:w-[50%] vsm:w-full">
          <div className="flex w-full flex-col gap-4">
            {errorMessage && (
              <p className="font-semibold text-pale-red">{errorMessage}</p>
            )}
            <div className="flex flex-row justify-between">
              <h2 className="text-2xl font-semibold">{artDetail[0]?.title}</h2>
              <button onClick={handleSave}>
                {isSaved ? (
                  <BsBookmarkFill className="w-5 h-5 cursor-pointer text-black transition duration-300" />
                ) : (
                  <BsBookmark className="w-5 h-5 cursor-pointer text-black transition duration-300" />
                )}
              </button>
            </div>
            <p className="text-justify">
              {artDetail[0]?.description}
            </p>

            <div className="flec flex-col gap-1">
              <p>Creator - <span className="font-semibold">{artDetail[0]?.creator}</span></p>
            </div>
            <div className="flex flex-col gap-1">
              <p>Make Your Offer</p>
              <div className="flex flex-row w-[55%] py-1 px-4 rounded-lg bg-light-slate justify-between items-center">
                <img
                  src={
                    artDetail[0]?.image
                      ? `http://localhost:3001/uploads/${artDetail[0]?.image}`
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt=""
                  className="border border-light-slate w-12 h-12 rounded-full object-fill"
                />
                <button
                  className="hover:bg-[#222222cc] hover:rounded-full hover:text-white"
                  onClick={handleDecrease}
                >
                  <BiMinus className="w-6 h-6" />
                </button>
                <div
                  className="bg-light-color py-1 px-3"
                  contentEditable
                  onBlur={handleAmountChange}
                  data-gramm="false" // Add data-gramm="false" attribute to ignore Grammarly
                  suppressContentEditableWarning={true}
                >
                  {amount}
                </div>
                <button
                  className="hover:bg-[#222222cc] hover:rounded-full hover:text-white"
                  onClick={handleIncrease}
                >
                  <BiPlus className="w-6 h-6" />
                </button>
              </div>
            </div>
            <button
              className="bg-blue-dark py-1 px-2 text-xl rounded-lg text-white font-semibold"
              onClick={() => {
                if (user) {
                  handleBid();
                } else {
                  navigate("/please-login");
                }
              }} // Add click event handler
            >
              {isLoading ? "Loading..." : "Bid"}
            </button>
          </div>
          {/* Render the modal if it's open */}
          {isModalOpen && (
            <AddressModal
              artDetail={artDetail}
              // artOwner={artOwner}
              amount={amount}
              onClose={() => setIsModalOpen(false)} // Close the modal when the close button is clicked
            />
          )}
        </div>
      </div>
      <div className="mt-4 mb-0 md:mb-0 vsm:mb-[8rem] vsm:mt-0 md:mt-2 px-4">
        <h3 className="noto-serif font-semibold">Top Bidders</h3>
        {filteredBids.map((bid) => {
          return (
            <div
              className="flex flex-row justify-between items-center gap-4 mt-4"
              key={bid._id}
            >
              <div className="flex flex-row items-center gap-4">
                <img
                  src={
                    userData[bid.user]?.image
                      ? `http://localhost:3001/uploads/${userData[bid.user]?.image
                      }`
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt=""
                  className="border border-light-slate w-12 h-12 rounded-full object-fill"
                />
                <p className="text-sm font-semibold">
                  {userData[bid.user]?.fullname}
                </p>
              </div>
              <p className="text-sm font-semibold">{bid.bidAmount}$</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtDetails;
