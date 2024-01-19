import axios from "axios";
import React, { useContext, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TotalArtsContext } from "../../context/TotalArtsContext";
import UpdateArtBody from "../PostArtPage/UpdateArtBody";

const IndividualYourArts = ({ art }) => {
  const { totalArts, updateTotalArts } = useContext(TotalArtsContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsHovered(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = (e) => {
    // e.stopPropagation();
    axios
      .delete(`http://localhost:3001/api/arts/${art.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Art deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
      });

    updateTotalArts(totalArts - 1);
  };

  return (
    <div>
      <div
        className="cursor-pointer relative w-fit bg-blue-dark dark:bg-black-75 rounded-lg flex flex-col gap-4 transition duration-200 pb-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={`http://localhost:3001/uploads/${art?.image}`}
          alt=""
          className="border border-light-slate rounded-lg w-[500px] h-[250px] md:w-[500px] md:h-[250px] vsm:w-100vw vsm:h-100vh object-fill"
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm text-white text-center font-semibold leading-[1.3] max-w-100vh text-ellipsis overflow-hidden">
            {art?.title}
          </p>

          <p className="text-sm text-center font-light leading-[1.3] text-white">
            {art?.creator}
          </p>

          <p className="text-sm text-center font-light leading-[1.3] text-white">
            {art?.startingBid}$
          </p>
        </div>

        {isHovered && (
          <div className="bg-[#000000aa] w-full h-full absolute top-0 left-0 rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-4">
              <button onClick={handleEditClick}>
                <FaEdit className="w-6 h-6 text-white transition duration-300 hover:text-lime-green" />
              </button>

              <div onClick={handleDeleteClick}>
                <BsTrash className="w-6 h-6 text-white transition duration-300 hover:text-pale-red" />
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UpdateArtBody closeModal={handleCloseModal} art={art} />
      )}

      {isDeleteModalOpen && (
        <div className="bg-[#000000cb] text-white fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
          {/* Delete confirmation modal */}
          <div className="modal relative w-full max-w-2xl overflow-auto">
            <div className="relative py-10 mx-5 bg-light-color p-4 rounded-xl shadow dark:bg-blue-dark">
              <button className="absolute top-3 right-4">
                <IoClose
                  onClick={handleCloseDeleteModal}
                  className="w-7 h-7 dark:text-white text-black transition duration-300"
                />
              </button>

              <p className="text-2xl dark:text-white text-black font-medium text-center mb-4">
                Delete Art
              </p>

              <p className="text-sm text-black dark:text-white text-center">
                Are you sure you want to delete this art?
              </p>

              <div className="flex justify-center gap-6 mt-6">
                <button
                   onClick={() => {
                    handleConfirmDelete();
                    handleCloseDeleteModal();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-dark text-white hover:text-lime-green hover:bg-black-75 text-base font-medium transition duration-300"
                >
                  Delete
                </button>

                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 rounded-lg bg-blue-dark text-white text-base font-medium transition duration-300 hover:text-pale-red hover:bg-light-slate"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualYourArts;
