"use client";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RxUpload } from "react-icons/rx";
import { TotalArtsContext } from "../../context/TotalArtsContext";
import { UserContext } from "../../context/UserContext";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";

const AddArtBody = () => {
  const { user } = useContext(UserContext);
  const { totalArts, updateTotalArts } = useContext(TotalArtsContext);
  const [artImage, setArtImage] = useState(null);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState(0);
  const [endingDate, setEndingDate] = useState(new Date());
  const [upcomingDate, setUpcomingDate] = useState(new Date());
  const [endingTime, setEndingTime] = useState("00:00");
  const [artType, setArtType] = useState("recent"); // Updated state to hold a single value
  const [categories, setCategories] = useState("abstract");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const artTypeOptions = ["Upcoming", "Recent"];

  const categoriesOptions = [
    "Abstract",
    "Painting",
    "Drawing",
    "Digital",
    "Mixed media",
  ];

  const formatDateForInput = (date) => {
    // Format the date to "yyyy-MM-dd" format
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleArtImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setArtImage(selectedImage);
  };

  const handleImageClose = () => {
    setArtImage(null); // Set the artImageUrl to null to close the image.
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCreatorChange = (e) => {
    setCreator(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleStartingBidChange = (e) => {
    setStartingBid(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    
    setEndingDate(e.target.value);
    setUpcomingDate(e.target.value);
  };

  const handleTimelineChange = (e) => {
    setEndingTime(e.target.value);
  };

  const handleArtTypeChange = (e) => {
    setArtType(e.target.value);
    // If changing the art type, reset the endingDate to the default
    setEndingDate(new Date());
    setUpcomingDate(new Date());
  };

  const handleCategoriesChange = (e) => {
    setCategories(e.target.value);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    setArtImage(null);
    setTitle("");
    setCreator("");
    setDescription("");
    setStartingBid(0);
    setEndingDate(new Date());
    setUpcomingDate(new Date());
    setEndingTime("00:00");
    setArtType("recent"); // Reset artType to a valid default value
    setCategories("abstract"); // Reset categories to a valid default value
    setError("");
    setMessage("");
  };

  const handleAddArt = async (e) => {
    e.preventDefault();

    try {
      // Upload the art image first
      const formData = new FormData();
      formData.append("uploadPictures", artImage);

      const response = await axios.post(
        "https://localhost:3001/api/arts/uploadArtPicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { filename } = response.data;

      // Format the endingDate in "yyyy-MM-dd" format
      const formattedEndingDate = endingDate;
      const formattedUpcomingDate = upcomingDate;

      // Format the endingTime in "HH:mm" format
      const formattedEndingTime = endingTime;

      // Combine the formatted date and time to form the complete endingDate
      const combinedEndingDate = `${formattedEndingDate}T${formattedEndingTime}:00.000Z`;
      const combinedUpcomingDate = `${formattedUpcomingDate}T${formattedEndingTime}:00.000Z`;

      // Add the art with the uploaded art image
      await axios.post(
        "https://localhost:3001/api/arts",
        {
          image: filename,
          title,
          creator,
          description,
          startingBid,
          endingDate: combinedEndingDate,
          upcomingDate: combinedUpcomingDate,
          artType,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Art added successfully.");
      updateTotalArts(totalArts + 1);
    } catch (error) {
      console.log(error);
      setError("Failed to add art.");
    } finally {
      setArtImage(null);
      setTitle("");
      setCreator("");
      setDescription("");
      setStartingBid(0);
      setEndingDate(new Date());
      setUpcomingDate(new Date());
      setArtType(""); // Reset artType to an empty string
      setCategories([]);
      setError("");
    }
  };

  return (
    <div className="bg-container items-center justify-center min-w-[75vw] py-2 mb-4 flex flex-col z-100">
      {user ? (
        <div className="relative w-full overflow-auto">
          {error && <span className="text-pale-red">{error}</span>}
          {message && <span className="text-lime-green">{message}</span>}
          <form className="my-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6">
            <div className="flex flex-col items-baseline gap-2">
              <label className="font-medium">Art Image</label>
              <div
                className="relative bg-white w-full h-28 md:h-full"
                onClick={handleUploadClick}
              >
                {artImage ? (
                  <>
                    <div className="text-center m-auto pt-2">
                      <span>{artImage.name}</span>
                      <p>Selected</p>
                    </div>
                    <button
                      className="absolute top-[0.25rem] right-[5rem]"
                      onClick={handleImageClose}
                    >
                      <IoClose className="w-7 h-7 text-black" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center gap-2 bg-white dark:bg-black dark:border dark:border-white">
                    <label htmlFor="image" className="flex flex-row gap-3">
                      <RxUpload className="cursor-pointer text-2xl text-black dark:text-white" />
                      <p className="cursor-pointer font-medium">
                        Choose art image
                      </p>
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      id="image"
                      name="artImage"
                      className="w-6 h-6 mb-4 invisible absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      ref={fileInputRef}
                      onChange={handleArtImageChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <TextFieldWithLabel
              label="Title"
              type="text"
              placeholder="Enter art name"
              value={title}
              onChange={handleTitleChange}
            />

            <TextFieldWithLabel
              label="Creator Name"
              type="text"
              placeholder="Enter creator name"
              value={creator}
              onChange={handleCreatorChange}
            />

            <TextFieldWithLabel
              label="Description"
              type="text"
              placeholder="Enter art description"
              value={description}
              onChange={handleDescriptionChange}
            />

            <TextFieldWithLabel
              label="Starting Bid"
              type="number"
              placeholder="Enter starting bid"
              value={startingBid}
              onChange={handleStartingBidChange}
            />

            <TextFieldWithLabel
              label="Deadline"
              type="date"
              placeholder="Enter ending date"
              // Conditionally set the value based on artType
              value={artType === "Upcoming" ? formatDateForInput(upcomingDate) : formatDateForInput(endingDate)}
              onChange={handleDeadlineChange}
            />

            <TextFieldWithLabel
              label="Timeline"
              type="time"
              placeholder="Enter ending time"
              value={endingTime}
              onChange={handleTimelineChange}
            />
            <div className="flex flex-col items-baseline gap-2">
              <label className="font-medium">Art Type</label>
              <select
                value={artType}
                onChange={handleArtTypeChange}
                className="block w-full bg-gray-100 dark:bg-black border border-light-color dark:border-white py-4 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {artTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-baseline gap-2">
              <label className="font-medium">Categories</label>
              <select
                value={categories}
                onChange={handleCategoriesChange}
                className="block w-full bg-gray-100 dark:bg-black border border-light-color dark:border-white py-4 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {categoriesOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-center justify-center md:col-span-2">
              <button
                type="submit"
                className="w-full mt-2 bg-blue-dark text-white text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-2 hover:font-bold"
                style={{ letterSpacing: "2px" }}
                onClick={handleAddArt}
              >
                ADD ART
              </button>

              <button
                type="button"
                className="w-full mt-2 bg-blue-dark dark:bg-dark-slate text-white text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-4 hover:font-bold"
                style={{ letterSpacing: "2px" }}
                onClick={handleReset}
              >
                RESET
              </button>
            </div>
          </form>
        </div>

      ) : (
        <div className="flex flex-col items-center mt-10 gap-4">
          <p className="font-medium text-center md-2:text-lg">
            You are not <span className="text-pale-red font-bold">logged in.</span>
          </p>

          <a
            href="/login"
            className="text-white text-lg font-medium bg-pale-red hover:bg-blue-dark py-2 px-8 rounded-lg cursor-pointer transition duration-300"
          >
            Log In
          </a>
        </div>
      )}
    </div>
  );
};

export default AddArtBody;
