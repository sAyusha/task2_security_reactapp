import React from "react";
import { IoClose } from "react-icons/io5";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-full max-h-full p-4 bg-white">
        <div className="flex justify-end">
          <button className="text-black text-xl hover:bg-[#cc0000] hover:text-white" onClick={onClose}>
            <IoClose className="w-6 h-6"/>
          </button>
        </div>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Full Size"
            className="object-contain max-w-full max-h-[80vh]"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
