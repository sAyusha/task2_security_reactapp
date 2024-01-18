import React from "react";

const Card = ({ children }) => {
  return (
    <div className="relative w-full h-full px-4 py-8 flex flex-col items-start justify-start gap-16 sm:justify-center sm:w-[50%] sm:gap-0 md:pl-[7%]">
      {children}
    </div>
  );
};

export default Card;
