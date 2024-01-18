import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // If token exists, fetch the user data
          const response = await axios.get("http://localhost:3001/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } else {
          // If token doesn't exist, set user state to null
          setUser(null);
        }
      } catch (error) {
        console.log(error);
        setUser(null); // Set user state to null in case of an error
      }
    };
  
    useEffect(() => {
      getUser();
      // console.log("fetch users:", user);
    }, []);

    // useEffect(() => {
    //   console.log("User:", user);
    // }, [user]); // Log the user whenever it changes
    // useEffect(() => {
    //   if(user){
    //     console.log("User full name:", user.fullname);
    //   }
    //   // console.log("User:", user);
    // }, [user]); // Log the user whenever it changes

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
