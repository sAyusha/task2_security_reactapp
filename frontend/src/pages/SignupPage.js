'use client';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';
import { FaRegEnvelope, FaRegUser, FaUser, FaAngleLeft } from 'react-icons/fa';
import { MdOutlinePhone } from 'react-icons/md';
import { Link } from "react-router-dom";
import login_pic from "../assets/images/login_pic.png";

import PasswordFieldWithLabel from '../components/Login-Signup/PasswordFieldWithLabel';
import TextFieldWithLabel from '../components/Login-Signup/TextFieldWithLabel';
import PrimaryButton from '../components/common/PrimaryButton';

export default function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isWindowMaximized, setIsWindowMaximized] = useState(true);

  const handleSignup = (e) => {
    e.preventDefault();
    // Assess password strength
    const passwordScore = zxcvbn(password);
    setPasswordStrength(passwordScore.score);
    axios
      .post("http://localhost:3001/api/users/register", {
        fullname,
        username,
        email,
        phone,
        password,
      })
      .then((response) => {
        setFullname("");
        setUsername("");
        setEmail("");
        setPhone("");
        setPassword("");
        setMessage(response.data.message);
        window.location.href = "/login";
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
      });
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
        return "error-red";
      case 1:
        return "pale-red";
      case 2:
        return "blue-dark";
      case 3:
        return "pale-green";
      case 4:
        return "lime-green";
      default:
        return "";
    }
  };


  const handlePasswordChange = (e) => {
    // Update password state
    setPassword(e.target.value);

    // Assess password strength on each input change
    const passwordScore = zxcvbn(e.target.value);
    setPasswordStrength(passwordScore.score);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWindowMaximized(window.innerWidth > 768); // Adjust the breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="bg-white flex flex-col justify-center sm:flex-row min-h-screen">
        <Link to="/">
          <button className="border dark:border-white p-1 rounded-[3px] sm:hidden">
            <FaAngleLeft className="text-xl text-black dark:text-white" />
          </button>
        </Link>
        <div className="w-full sm:w-4/5 flex justify-center py-12 align-item:center">
          <div className="flex flex-col space-y-4 w-3/2 lg:w-3/5">
            <h1 className="text-3xl noto-serif">Sign Up!!!</h1>
            <p className='text-sm text-dark-slate'>The faster you fill up, the faster chance to win!!!</p>
            <div className="flex flex-col space-y-3">
              <form className="flex flex-col gap-4">
                {error && <span className="text-pale-red">{error}</span>}

                {message && <span className="text-pale-green">{message}</span>}

                <TextFieldWithLabel
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  icon={FaUser}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />

                <TextFieldWithLabel
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  icon={FaRegUser}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextFieldWithLabel
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  icon={FaRegEnvelope}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextFieldWithLabel
                  label="Phone"
                  type="phone"
                  placeholder="Enter your contact no."
                  icon={MdOutlinePhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <PasswordFieldWithLabel
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                />

                {password && (
                  <div className="text-sm text-blue-dark">
                    Password Strength:{" "}
                    <span
                      className={`text-${getPasswordStrengthColor(
                        passwordStrength
                      )}`}
                    >
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      name="terms-of-service"
                      id="terms-of-service"
                      className="custom-checkbox relative top-1 dark:border-white"
                    />
                    <label
                      htmlFor="terms-of-service"
                      className=" dark:text-white"
                    >
                      I have read and agree to the Terms of Service
                    </label>
                  </div>
                </div>

                <PrimaryButton
                  btnLabel="NEXT"
                  // isLoading={isLoading}
                  onClick={handleSignup}
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
                <p className="text-sm">Already have an account?</p>
                <a href="/login" className="font-semibold ml-2">
                  <button type="submit" style={{ fontFamily: 'Montserrat' }}>Sign In</button>
                </a>

              </div>
            </div>
          </div>
        </div>
        {isWindowMaximized && (
          <div className="bg-[#f5e8e8] sm:w-3/5 text-black px-24 py-10 sm:py-20 flex flex-col justify-center items-center">
            <div className="mb-5">
              <img src={login_pic} alt="logo" className="w-full" />
            </div>
            <h2 className="noto-serif text-3xl sm:text-4xl text-center mb-2">Artalayst</h2>
            <p className="mb-2 text-center text-lg">where people meet art</p>
          </div>
        )}
      </div>
    </div>
  );
}
