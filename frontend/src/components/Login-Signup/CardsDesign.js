import React from "react";
// import BooksPile from "../../assets/images/books-pile.png";
import CoverPic from "../../assets/images/cover.png";

const CardsDesign = () => {
  return (
    <div className="hidden sm:flex justify-center relative pt-4 sm:w-[50%] -right-[7%] md:w-[55%]">
      <div className="w-[70vw] h-[70vw] min-w-[350px] min-h-[350px] relative sm:w-[50vw] sm:h-[50vw] lg:w-[45vw] lg:h-[45vw]">
        <div className="max-w-[70%] absolute left-[8%]">
          <img src={CoverPic} alt="" />
        </div>
      </div>
    </div>

  );
};

export default CardsDesign;
