import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { UserContext } from "../../context/UserContext";

const UpcomingArts = ({
  art,
  handleArtClick,
  fetchUserInfo,
  userInfo,
  activeTab,
  handleTabClick,
}) => {
  const [isAlert, setIsAlert] = useState(false);
  const [artOwner, setArtOwner] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user: currentUser, setUser } = useContext(UserContext);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/api/users/${art._id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((res) => {
  //       setArtOwner(res.data.data);
  //       setIsAlert(res.data.data[0].alerts.includes(art._id));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [art]);
  useEffect(() => {
    if (currentUser) {
      setIsAlert(currentUser?.data[0].alerts.includes(art.id));
    }
  }, [currentUser, art._id]);

  const handleAlert = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      } else {
        if (isAlert) {
          // Remove alert
          await axios
            .delete(`http://localhost:3001/api/arts/alert/${art.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              setIsAlert(false);
              setSuccessMessage("Art removed from alerts!");

              axios
                .get(
                  `http://localhost:3001/api/users/${currentUser?.data[0].id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((res) => {
                  setUser(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          // Add alert
          await axios
            .post(`http://localhost:3001/api/arts/alert/${art.id}`, null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              setIsAlert(true);
              setSuccessMessage("Art added to alerts!");

              axios
                .get(
                  `http://localhost:3001/api/users/${currentUser?.data[0].id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((res) => {
                  setUser(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              setError(err.response.data.error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error) {
      setShowError(true);

      // Clear the error message after 5 seconds (adjust the duration as needed)
      const timeout = setTimeout(() => {
        setShowError(false);
        setError(""); // Clear the error state
      }, 3000);

      // Clean up the timeout when the component unmounts or when the error changes
      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      // Set showSuccess to true and display the success message
      setShowSuccess(true);

      // Clear the success message after 3 seconds (adjust the duration as needed)
      const timeout = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage(""); // Clear the successMessage state
      }, 3000);

      // Clean up the timeout when the component unmounts or when the successMessage changes
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <div
      className="cursor-pointer relative w-full bg-dark-slate-85 dark:bg-black-75 rounded-xl transition duration-200 hover:scale-[1.01]"
      onClick={() => {
        handleTabClick("upcoming");
      }}
    >
      <div className="cursor-pointer relative w-fit bg-light-color dark:bg-black-75 p-4 rounded-lg flex flex-col gap-4 transition duration-200">
        {showError && (
          <div className="absolute px-4 top-0 left-0 w-full h-full rounded-xl bg-[#00000096] flex items-center justify-center z-50">
            <p className="text-white text-center font-semibold text-sm">
              {error}
            </p>
          </div>
        )}

        {showSuccess && (
          <div className="absolute px-4 top-0 left-0 w-full h-full rounded-xl bg-[#00000096] flex items-center justify-center z-50">
            <p className="text-white text-center font-semibold text-sm">
              {successMessage}
            </p>
          </div>
        )}

        <button className="absolute right-4 top-2absolute rounded-xl bg-light-slate hover:bg-pink-light p-2" onClick={(handleAlert)}>
          {isAlert ? (
            <IoMdNotifications className="text-2xl" />
          ) : (
            <IoMdNotificationsOutline className="text-2xl" />
          )}
        </button>

        <img
          src={`http://localhost:3001/uploads/${art?.image}`}
          alt=""
          className="rounded-lg w-[500px] h-[250px] md:w-[500px] md:h-[250px] vsm:w-100vw vsm:h-100vh object-cover"
        />

        <div className="flex flex-col justify-start px-2 gap-1">
          <p className="text-lg text-black font-semibold leading-[1.3] max-w-100vh text-ellipsis overflow-hidden dark:text-white">
            {art?.title}
          </p>
          <p className="text-lg font-medium vsm:text-base">
            {art?.startingBid}$
          </p>
          <p className="text-lg font-medium vsm:text-base">
            Upcoming Date:{" "}
            {new Date(art?.upcomingDate).toLocaleDateString("en-US")}
          </p>
          <p className="text-lg font-medium vsm:text-base">{art?.creator}</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingArts;