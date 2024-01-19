import React, { useContext, useEffect, useState } from "react";
import Button from "./Button";
// import ChangePassword from "./ChangePassword";
// import EditProfile from "./EditProfile";
import axios from "axios";
import {
  BsFillBookmarkFill,
  BsFillCollectionFill,
  BsFillFilePostFill,
} from "react-icons/bs";
import { MdCircleNotifications } from "react-icons/md";
import AlertedArts from "./AlertedArts";
import SavedArts from "./SavedArts";
import UserInfo from "./UserInfo";
import YourArts from "./YourArts";
import { UserContext } from "../../context/UserContext";

const ProfileBody = ({ activeTab, handleTabClick }) => {
  const [activeButton, setActiveButton] = useState("Posts");
  const [myArts, setMyArts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/arts/myArts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMyArts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(myArts);

  const handleButtonClick = (btnName) => {
    setActiveButton(btnName);
  };

  const formComponent =
    activeButton === "Posts" ? (
      <YourArts myArts={myArts} />
    ) : activeButton === "Saved" ? (
      <SavedArts />
    ) : activeButton === "Alerts" ? (
      <AlertedArts />
    ) : null;

  return (
    <div className="mt-5 mb-16 flex flex-col xl:flex-column">
      <UserInfo
        myArts={myArts}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />

      <div className="border-b border-light-slate w-full"></div>

      <div className="w-full flex flex-col gap-6">
        {user?.data[0]?.userType !== "admin" ? (
          <div className="flex flex-wrap gap-2 md:gap-[8rem] vsm:gap-[2rem] justify-center">
            <div className="cursor-pointer flex flex-row items-center border-t-2 text-dark-slate border-dark-slate hover:text-black ">
              <BsFillFilePostFill className="md:w-6 h-6 mt-2" />
              <Button
                btnName="Posts"
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
              />
            </div>
            <div className="cursor-pointer flex flex-row items-center border-t-2 text-dark-slate border-dark-slate hover:text-black">
              <BsFillBookmarkFill className="md:w-6 h-6 mt-2" />
              <Button
                btnName="Saved"
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
              />
            </div>

            <div className="cursor-pointer flex flex-row items-center border-t-2 text-dark-slate border-dark-slate hover:text-black ">
              <MdCircleNotifications className="md:w-7 h-6 mt-2" />
              <Button
                btnName="Alerts"
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
              />
            </div>
          </div>
        ) :
          <div className="cursor-pointer flex flex-row items-center border-t-2 text-dark-slate border-dark-slate hover:text-black ">
            <BsFillFilePostFill className="md:w-6 h-6 mt-2" />
            <Button
              btnName="Posts"
              activeButton={activeButton}
              handleButtonClick={handleButtonClick}
            />
          </div>
        }

        {formComponent}
      </div>
    </div>
  );
};

export default ProfileBody;
