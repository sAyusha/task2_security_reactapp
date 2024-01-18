import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const PasswordFieldWithLabel = ({ label, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
    }

    onChange(e);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="font-semibold dark:text-white">
        {label}

        {error && (
          <span className="text-sm font-medium dark:text-pink-light text-blue-dark-hover">
            {" "}
            ({error})
          </span>
        )}
      </label>

      <div className="p-4 bg-white dark:bg-black flex items-center gap-2 border border-light-color dark:border-white dark:text-white transition-all duration-200 ease-linear hover:border-pink-light focus:border-pink-light">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder={placeholder}
          value={value}
          onChange={handlePasswordChange}
          className="flex-1 outline-none rounded-[3px] text-[13px]placeholder:text-light-slate dark:bg-black dark:text-white"
        />

        <div onClick={handleTogglePassword} className="cursor-pointer">
          {showPassword ? (
            <AiFillEye className="text-2xl text-dark-slate dark:text-white" />
          ) : (
            <AiFillEyeInvisible className="text-2xl text-dark-slate dark:text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordFieldWithLabel;
