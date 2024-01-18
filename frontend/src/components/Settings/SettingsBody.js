import React, { useState } from "react";
import EditProfilePage from "./EditProfilePage";
import ChangePasswordPage from "./ChangePasswordPage";
import SettingsHeader from "../common/SettingsHeader";
import InitialContent from "./InitialContent"; // Import the InitialContent component

export default function SettingsBody() {
  const [currentPage, setCurrentPage] = useState(null);

  const handleEditProfileClick = () => {
    setCurrentPage("EditProfile");
  };

  const handleChangePasswordClick = () => {
    setCurrentPage("ChangePassword");
  };

  const renderContent = () => {
    if (currentPage === "EditProfile" || currentPage === "ChangePassword") {
      return null; // Return nothing (null) when the buttons are clicked to hide the InitialContent
    } else {
      return <InitialContent />; // Show the InitialContent component initially
    }
  };

  return (
    <div>
      <SettingsHeader
        handleEditProfileClick={handleEditProfileClick}
        handleChangePasswordClick={handleChangePasswordClick}
      />
      {renderContent()}
      {/* Conditionally render the corresponding pages */}
      {currentPage === "EditProfile" && <EditProfilePage />}
      {currentPage === "ChangePassword" && <ChangePasswordPage />}
    </div>
  );
}
