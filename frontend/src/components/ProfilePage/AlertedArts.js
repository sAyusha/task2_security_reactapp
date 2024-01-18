import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import IndividualAlertArts from "./IndividualAlertArts";

const AlertedArts = ({ userInfo, fetchUserInfo }) => {
  const { user: currentUser } = useContext(UserContext);
  // const [arts, setArts] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3001/api/arts/others", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((res) => {
  //       setArts(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // // Filter saved arts from user savedArts
  // const alertedArts = arts.filter((art) =>
  //   currentUser?.data[0].alerts.includes(art._id)
  // );

  return (
    <div>
      {currentUser?.data[0].alerts.length === 0 ? (
        <p className="font-medium text-center md-2:text-lg">
          You haven't alerted any arts yet.
        </p>
      ) : (
        <div className="grid items-stretch grid-cols-2 gap-6 vsm:grid-cols-2 sm:grid-cols-2 md-2:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5">
          {currentUser?.data[0].alerts.map((artId) => (
            <IndividualAlertArts
              key={artId}
              artId={artId}
              userInfo={userInfo}
              fetchUserInfo={fetchUserInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertedArts;
