' use client '
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const TotalArtsContext = createContext();

export const TotalArtsProvider = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [totalArts, setTotalArts] = useState(0);

  const updateTotalArts = (count) => {
    setTotalArts(count);
  };

  useEffect(() => {
    const fetchTotalArts = async () => {
      if (!user) {
        setTotalArts(0);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3001/api/arts/myArts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const arts = response.data.data;
        // console.log(arts);
        const userArts = arts.filter((art) => art.user === user.id);
        setTotalArts(userArts.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalArts();
  }, [user, totalArts]);

  return (
    <TotalArtsContext.Provider value={{ totalArts, updateTotalArts }}>
      {children}
    </TotalArtsContext.Provider>
  );
};
