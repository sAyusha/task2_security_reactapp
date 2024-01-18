import React from "react";

const SettingsHeader = ({ handleEditProfileClick, handleChangePasswordClick }) => {
  return (
    <header className="relative flex justify-between left-0 md:pt-2 md:items-center">
      <div className="flex flex-row flex-grow justify-between">
        <h2
          className="leading-tight font-semibold text-center lg:text-3xl"
          style={{ letterSpacing: "2px", fontSize: "30px", textTransform: "uppercase" }}
        >
          Settings
        </h2>
        <div className="flex flex-row ">
          <button
            className="text-white rounded-lg mr-2 p-2 bg-blue-dark hover:text-black hover:bg-pink-light border border-light-color text-sm font-semibold"
            onClick={handleEditProfileClick}
          >
            Edit Profile
          </button>
          <button
            className="text-white rounded-lg mr-2 p-2 bg-blue-dark hover:text-black hover:bg-pink-light border border-light-color text-sm font-semibold"
            onClick={handleChangePasswordClick}
          >
            Change Password
          </button>
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;
