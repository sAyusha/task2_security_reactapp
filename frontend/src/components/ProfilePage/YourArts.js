import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import IndividualYourArts from "./IndividualYourArts";

const YourArts = ({ myArts }) => {
  const { user, setUser } = useContext(UserContext);

  const userId = user.id;

  return (
    <div>
      {myArts.length === 0 ? (
        <p className="font-medium text-center md-2:text-lg">
          You haven't posted any arts yet.
        </p>
      ) : (
        <div className="grid items-stretch grid-cols-2 gap-6 vsm:grid-cols-2 sm:grid-cols-2 md-2:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5">
          {myArts.map((art) => (
            <IndividualYourArts
              key={art.id}
              art={art}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default YourArts;
