import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import CardsDesign from "../components/Login-Signup/CardsDesign";
import AuthCard from "../components/Login-Signup/AuthCard";
import TextFieldWithLabel from "../components/Login-Signup/TextFieldWithLabel";
import PrimaryButton from "../components/common/PrimaryButton";


const ForgotPasswordPage = () => {
  return (
    <div className="bg-container bg-contain bg-no-repeat min-h-screen flex bg-light-bg dark:bg-dark-bg">
      <div className="w-full flex flex-col items-center sm:flex-row-reverse">
        <CardsDesign />

          <AuthCard>
          <Link to="/">
            <button className="border dark:border-white p-1 rounded-[3px] sm:hidden">
              <FaAngleLeft className="text-xl text-black dark:text-white" />
            </button>
          </Link>

          <div className="w-full h-full mb-1 flex flex-col gap-8 sm:justify-center">
            <div>
              <h1 className="dark:text-white">Forgot Password?</h1>

              <p className="text-dark-slate">
                Enter the email address associated with your account.
              </p>
            </div>

            <form className="flex flex-col gap-8">
              <TextFieldWithLabel
                label="Email"
                type="email"
                placeholder="Enter your email"
                icon={HiMail}
              />

              <PrimaryButton btnLabel="Start Recovery" />
            </form>

            <div className="hidden sm:flex flex-col justify-center items-center gap-1 lg:flex-row lg:gap-2 lg:mt-[3%]">
              <Link to="/register" className="font-semibold dark:text-white">
                Create new account
              </Link>
              |
              <Link to="/login" className="font-semibold dark:text-white">
                Back to Login
              </Link>
            </div>
          </div>
    </AuthCard>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
