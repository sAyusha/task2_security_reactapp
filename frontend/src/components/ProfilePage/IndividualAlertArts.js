import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { UserContext } from "../../context/UserContext";

const IndividualAlertArts = ({ artId, userInfo }) => {
  const [art, setArt] = useState([]);
  const [isAlert, setIsAlert] = useState(true);
  const { user: currentUser, setUser } = useContext(UserContext);
  const [artOwner, setArtOwner] = useState({});

  // const artId = art.data ? art.data[0]?._id : "";

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/api/users/${artId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((res) => {
  //       setArtOwner(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [artId]);

  useEffect(() => {
    if (currentUser) {
      setIsAlert(currentUser?.data[0].alerts.includes(artId));
    }
  }, [currentUser, artId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/arts/${artId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setArt(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [artId]);

  const removeAlert = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      // const id = art.data[0]?.id;
      if (!token) {
        // Handle case when user is not logged in
        return;
      }
      if (isAlert) {
        // Remove alert
        await axios.delete(`http://localhost:3001/api/arts/alert/${artId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser((prevUser) => {
          const updatedAlertedArts =
            prevUser?.data[0].alerts.filter(
              (artid) => artid !== artId
            );
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                alerts: updatedAlertedArts,
              },
            ],
          };
        });
        setIsAlert(false);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  return (
    <div className="cursor-pointer relative w-fit bg-blue-dark dark:bg-black-75 rounded-lg flex pb-4 flex-col gap-4 transition duration-200">
      <button className="absolute rounded-xl bg-light-slate hover:bg-pink-light p-2 top-3 right-2" onClick={removeAlert}>
        {isAlert ? (
          <IoMdNotifications className="text-2xl" />
        ) : (
          <IoMdNotificationsOutline className="text-2xl" />
        )}
      </button>

      <img
        src={
          art.data
            ? `http://localhost:3001/uploads/${art.data[0]?.image}`
            : "https://odessa-journal.com/public/oj/img/default-image.jpg"
        }
        alt=""
        className="rounded-lg w-[500px] h-[250px] md:w-[500px] md:h-[250px] vsm:w-100vw vsm:h-100vh object-fill"
      />

      <div className="flex flex-col gap-1">
        <p className="text-sm text-white text-center font-medium leading-[1.3] max-w-100vh text-ellipsis overflow-hidden">
          {art.data ? art.data[0]?.title : ""}
        </p>

        <p className="text-sm text-white text-center font-light leading-[1.3]">
          Creator: {art.data ? art.data[0]?.creator : ""}
        </p>

        <div className="flex justify-center items-center gap-1 mt-1">
          {/* <img
            src={
              artOwner[0]?.profilePicture
                ? `http://localhost:3001/uploads/${artOwner[0]?.profilePicture}`
                : "https://i.pinimg.com/564x/44/d7/c7/44d7c719174e131f302172452f4c89e0.jpg"
            }
            alt=""
            className="w-[20px] h-[20px] rounded-full object-fill"
          /> */}

          <p className="text-xs text-pale-yellow">
          Upcoming Date: {art.data ? new Date(art.data[0]?.upcomingDate).toLocaleDateString("en-US") : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndividualAlertArts;
