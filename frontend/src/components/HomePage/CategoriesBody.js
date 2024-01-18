import React, { useState } from "react";
import Art from "./Art";
import Button from "./Categories/Button";

const CategoriesBody = ({ arts }) => {
  const [activeButton, setActiveButton] = useState("Abstract");

  const handleButtonClick = (btnName) => {
    setActiveButton(btnName);
  };

  // Filter the arts based on the active button's category
  const filteredArts = arts.filter(
    (art) =>
      (activeButton === "Abstract" || art.categories === activeButton) &&
      art.artType !== "Upcoming"
  );

  return (
    <div className="flex flex-col xl:flex-column">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 md:gap-0 vsm:px-0 px-[2rem] md:px-[2rem] vsm:gap-2 justify-between">
          {/* Render buttons dynamically */}
          {["Abstract", "Painting", "Drawing", "Digital", "Mixed media"].map(
            (category) => (
              <div
                key={category}
                className={`cursor-pointer flex flex-row items-center text-dark-slate border-dark-slate hover:text-black ${
                  activeButton === category ? "text-black" : ""
                }`}
              >
                <Button
                  btnName={category}
                  activeButton={activeButton}
                  handleButtonClick={handleButtonClick}
                />
              </div>
            )
          )}
        </div>

        {filteredArts.length === 0 && (
          <div className="my-6 text-center">
            <p className="font-medium text-pale-red">
              No <span className="font-bold">arts</span> available for{" "}
              <span className="font-bold">"{activeButton}"</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filteredArts.map((art, index) => (
          <Art key={index} art={art} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesBody;
