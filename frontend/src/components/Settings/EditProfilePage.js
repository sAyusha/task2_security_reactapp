import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

const EditProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user?.data[0].fullname || "");
      setUsername(user?.data[0].username || "");
      setEmail(user?.data[0].email || "");
      setPhone(user?.data[0].phone || "");
      setBio(user?.data[0].bio || "");
      setInitialValues({
        fullname: user?.data[0].fullname || "",
        username: user?.data[0].username || "",
        bio: user?.data[0].bio || "",
        email: user?.data[0].email || "",
        phone: user?.data[0].phone || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:3001/api/users/editProfile`,
        {
          fullname,
          username,
          email,
          phone,
          bio,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      setSuccess(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleReset = () => {
    setFullname(initialValues.fullname);
    setUsername(initialValues.username);
    setEmail(initialValues.email);
    setPhone(initialValues.phone);
    setBio(initialValues.bio);
    setError("");
  };

  return (
    <form
      // onSubmit={handleProfileUpdate}
      className="z-100 my-6 vsm:pb-10 pb-0 md:pb-0 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6 md-2:grid-cols-1 lg:grid-cols-2"
    >
      {error && (
        <div className="text-pale-red md:col-span-2 md-2:col-span-1 lg:col-span-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-lime-green md:col-span-2 md-2:col-span-1 lg:col-span-2">
          Profile updated successfully!
        </div>
      )}

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="fullname" className="font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
          data-testid="fname"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="username" className="font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="phone" className="font-medium">
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2 md-2:col-span-1 lg:col-span-2">
        <label htmlFor="bio" className="font-medium">
          Bio
        </label>
        <input
          type="text"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col items-center justify-center md:col-span-2">
        <button
          type="submit"
          className="w-full mt-2 bg-blue-dark text-white text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-2 hover:font-bold"
          style={{ letterSpacing: "2px" }}
          onClick={handleProfileUpdate}
        >
          UPDATE NOW
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
  );
};

export default EditProfilePage;
