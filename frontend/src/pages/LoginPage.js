'use client';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FaUser, FaRegUser, FaAngleLeft } from 'react-icons/fa';

import login_pic from "../assets/images/login_pic.png";
import logo from "../assets/images/logo.svg";

import TextFieldWithLabel from "../components/Login-Signup/TextFieldWithLabel";
import PasswordFieldWithLabel from '../components/Login-Signup/PasswordFieldWithLabel';
import PrimaryButton from '../components/common/PrimaryButton';
import { UserContext } from '../context/UserContext';

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const [isWindowMaximized, setIsWindowMaximized] = useState(true);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWindowMaximized(window.innerWidth > 768); // Adjust the breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignin = (e) => {
    e.preventDefault();

    // Perform form validation
    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    axios
      .post("http://localhost:3001/api/users/login", { username, password })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        // Assuming the user data is returned in the response
        const user = response.data.user;
        setUser(user);
        window.location.href = "/";
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-light-bg dark:bg-dark-bg">
      <div className="bg-white flex flex-col w-full justify-center sm:flex-row min-h-screen">
        <Link to="/">
          <button className="border dark:border-white p-1 rounded-[3px] sm:hidden">
            <FaAngleLeft className="text-xl text-black dark:text-white" />
          </button>
        </Link>
        {isWindowMaximized && (
          <div className="bg-[#f5e8e8] sm:w-3/5 text-black px-24 py-10 sm:py-20 flex flex-col items-center">
            <div className="mb-5">
              <img src={login_pic} alt="logo" className="w-80 sm:w-100" />
            </div>
            <h2 className="noto-serif text-3xl sm:text-4xl text-center mb-2">Artalayst</h2>
            <p className="mb-2 text-center text-lg">where people meet art</p>
          </div>
        )}

        <div className="w-full sm:w-3/4 flex justify-center py-10 align-item:center">
          <div className="flex flex-col space-y-4 w-4/5 sm:w-3/4 lg:w-3/5">
            <img src={logo} alt="logo" className="w-28 sm:w-32 mx-auto" />
            <h1 className="noto-serif text-3xl">Welcome Back!!!</h1>

            <form autoComplete="on" className="flex flex-col gap-2">
              {error && <span className="text-error-red">{error}</span>}

              <TextFieldWithLabel
                label="Username"
                icon={FaRegUser}
                type="username"
                placeholder="Enter your username"
                onChange={handleUsernameChange}
              />
              <PasswordFieldWithLabel
                label="Password"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
              />

              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="remember-me" id="remember-me" autoComplete='on'/>
                  <label
                    htmlFor="remember-me"
                    className="font-medium dark:text-white"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgotPassword"
                  className="font-medium dark:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <PrimaryButton
                btnLabel="LOGIN"
                onClick={handleSignin}
              // isLoading={isLoading}
              />
              <div className="flex items-center gap-4 px-[10%] py-2">
                <hr className="flex-1 border dark:border-white" />
                <p className="font-semibold dark:text-white">or</p>
                <hr className="flex-1 border dark:border-white" />
              </div>

              <Link to="/">
                <button className="w-full flex items-center justify-center gap-2 bg-none border border-black dark:border-white rounded-[3px] py-3 px-5 sm:px-8">
                  <FaUser className="text-xl text-black dark:text-white" />
                  <p className="font-semibold dark:text-white">
                    Continue as Guest
                  </p>
                </button>
              </Link>
            </form>
            <div className="flex items-center justify-center">
              <p className="text-sm">Don't have an account?</p>
              <a href="/register" className="font-semibold ml-2">
                <button type="submit" style={{ fontFamily: 'Montserrat' }}>Sign Up</button></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
