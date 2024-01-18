import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";

const Header = (props) => {
  const [theme, setTheme] = useState(localStorage.theme || "light");

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="relative flex justify-between left-0 md:pt-4 vsm:items-center md:items-center">
      <div className="flex sm:flex-col sm:flex-grow">
        <h2 className="leading-tight w-full md:w-full vsm:w-[300px] md:text-[30px] vsm:pl-0 pl-0 md:pl-[13rem] vsm:text-[22px] font-semibold text-left vsm:text-left md:text-center lg:text-3xl"
          style={{ letterSpacing: "2px", textTransform: "uppercase" }}
        >
          {props.currentPage}
        </h2>
      </div>

      <div className="flex flex-row justify-end items-center text-black text-sm dark:text-white w-60">
        <div
          className="cursor-pointer md:hidden justify-end"
          onClick={() => props.handleTabClick("settings")}
        >
          <FiSettings className="w-4 h-4 mr-2" />

        </div>

        <div className="flex md:hidden border border-light-color">
          <button
            className={`p-2 ${theme === "light" ? "bg-black-75" : "bg-dark-bg"
              } dark:bg-white dark:text-black text-pale-yellow`}
            onClick={handleThemeChange}
            data-testid="theme-sun-button"
          >
            <BsFillSunFill className="w-3.5 h-3.5" />
          </button>
          <button
            className={`p-2 ${theme === "light" ? "bg-light-bg" : "bg-purple-lighter"
              } text-black dark:text-pale-yellow`}
            onClick={handleThemeChange}
            data-testid="theme-moon-button"
          >
            <BsMoonFill className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
