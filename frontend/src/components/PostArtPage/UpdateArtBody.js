import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { HiMail } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { RxUpload } from "react-icons/rx";
import { UserContext } from "../../context/UserContext";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";
import { FaArrowCircleLeft } from "react-icons/fa";

const UpdateArtBody = ({ art, closeModal }) => {
    const { setUser } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [startingBid, setStartingBid] = useState(0);
    // const [artImage, setArtImage] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (art.id) {
            axios
                .get(`http://localhost:3001/api/arts/${art.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((response) => {
                    const { title, startingBid } = response.data.data[0];
                    setTitle(title);
                    setStartingBid(startingBid);
                })
                .catch((error) => console.log(error));
        }
    }, [art.id]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleStartingBidChange = (e) => {
        setStartingBid(e.target.value);
    };

    // const handleArtImageChange = (e) => {
    //   setArtImage(e.target.files[0]);
    // };

    const handleReset = () => {
        // setArtImage(null);
        setTitle("");
        setStartingBid(0);
        setError("");
        setMessage("");
    };

    console.log(art)

    const handleUpdateArt = (e) => {
        e.preventDefault();
        axios
            .put(
                `http://localhost:3001/api/arts/${art.id}`,
                {
                    // image: filename,
                    title,
                    startingBid,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then((response) => {
                setMessage("Art updated successfully.");
                closeModal();
            })
            .catch((error) => {
                console.log(error);
                setError("Failed to update art.");
            });
    };

    return (
        <div className="bg-[#000000cb] text-black dark:text-white fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
            <div className="modal relative w-full max-w-2xl overflow-auto">
                <div className="relative my-10 mx-5 bg-light-bg dark:bg-black-75 p-4 rounded-xl shadow dark:bg-gray-700">
                    <button className="absolute top-3 right-4">
                        <IoClose
                            onClick={closeModal}
                            className="w-7 h-7 text-black dark:text-white"
                        />
                    </button>

                    {error && <span className="text-pale-red">{error}</span>}

                    {message && <span className="text-pale-green">{message}</span>}

                    <form className="my-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6">

                        <TextFieldWithLabel
                            label="Title"
                            type="text"
                            placeholder="Enter art title"
                            value={title}
                            onChange={handleTitleChange}
                        />

                        <TextFieldWithLabel
                            label="Starting Bid"
                            type="number"
                            placeholder="Enter starting bid"
                            value={startingBid}
                            onChange={handleStartingBidChange}
                        />

                        <div className="flex items-center justify-between md:col-span-2">
                            <button
                                type="button"
                                className="w-fit mt-4 bg-black dark:bg-dark-slate text-white text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
                                onClick={handleReset}
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                className="w-fit mt-4 bg-purple-lighter-black-20 text-black font-semibold text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
                                onClick={handleUpdateArt}
                            >
                                Update Art
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateArtBody;
