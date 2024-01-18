import React from "react";
import SettingIllustration from "../../assets/images/settings.svg";


const InitialContent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-80">
      <img
        src={SettingIllustration}
        alt="Initial Image"
        className="w-32 h-32 mb-4"
      />
      <p className="text-center text-gray-500">
        Click on {" "}
            <span className="font-bold">"Edit Profile"</span> or {""}
            <span className="font-bold">"Change Password"</span> 
            {" "} button to make desired changes.
      </p>
    </div>
  );
};

export default InitialContent;
