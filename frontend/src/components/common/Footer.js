import React from 'react';
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { FaGlobeAsia } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="hidden md:flex justify-between my-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer text-[15px] text-black dark:text-white hover:text-purple-lighter hover:dark:text-purple-lighter transition duration-200 ease-linear">
              <FaGlobeAsia className="w-3.5 h-3.5" />
              <p>English</p>
            </div>

            <div className="cursor-pointer text-[15px] text-black dark:text-white hover:text-purple-lighter hover:dark:text-purple-lighter transition duration-200 ease-linear">
              <p>Privacy Policy</p>
            </div>

            <div className="cursor-pointer text-[15px] text-black dark:text-white hover:text-purple-lighter hover:dark:text-purple-lighter transition duration-200 ease-linear">
              <p>License</p>
            </div>

            <div className="cursor-pointer text-[15px] text-black dark:text-white hover:text-purple-lighter hover:dark:text-purple-lighter transition duration-200 ease-linear">
              <p>API</p>
            </div>
          </div>

          <div className="flex border border-black">
            <button className="p-2 bg-purple-lighter text-black dark:text-white">
              <BsFillSunFill className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 bg-light-bg dark:bg-dark-bg text-black dark:text-white">
              <BsMoonFill className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
  )
}

export default Footer
