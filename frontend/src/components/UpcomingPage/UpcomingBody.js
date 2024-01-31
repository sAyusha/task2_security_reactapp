import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";

export default function UpcomingBody() {
  const [arts, setArts] = useState([]);

  useEffect(() => {
    axios
      // .get("http://localhost:3001/api/arts/others", {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // })
      .get("https://localhost:3001/api/arts", {})
      .then((res) => {
        setArts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // filter upcoming arts by artType
  const upcomingArts = arts.filter((art) => art.artType === "Upcoming");

  return (
    <div className="mt-6 flex flex-col gap-6">
      {upcomingArts.length === 0 && (
        <div className="mt-2">
          <p className="font-medium text-pale-red">
            No <span className="font-bold">upcoming arts</span> available.
          </p>
        </div>
      )}

      {upcomingArts.map((art) => (
        <div
          key={art._id}
          className=" flex flex-col m-auto p-[1.5rem] w-[80%] border-2 rounded-2xl border-light-slate"
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-row justify-between pb-2">
            <p className="noto-serif text-black dark:text-white text-2xl font-semibold leading-[1.3]">
              {new Date(art?.upcomingDate).toLocaleDateString("en-US")}
            </p>
            <button>
              {art.isAlert ? (
                <IoMdNotifications className="text-2xl" />
              ) : (
                <IoMdNotificationsOutline className="text-2xl" />
              )}
            </button>
          </div>
          <div className="w-full border-b border-light-color"></div>
          <div className="flex flex-row pt-4 gap-2 md:flex-row vsm:flex-col w-full">
            <img
              src={`https://localhost:3001/uploads/${art?.image}`}
              className="md:w-[250px] w-[250px] vsm:w-full rounded-lg h-[250px] object-fill"
              alt="img"
            />
            <div className="flex flex-col vsm:gap-2 md:gap-4 md:pl-10 md:pt-5">
              <h3 className="vsm:text-sm text-[21px] text-black dark:text-white font-semibold md:text-2xl leading-[1.3] text-ellipsis">
                {art?.title}
              </h3>

              <p className="text-medium font-medium md:text-lg text-black dark:text-white vsm:text-sm vsm:font-light md:font-medium leading-[1.3]">
                {art?.startingBid$}
              </p>
              <p className="text-medium font-medium md:text-lg text-black dark:text-white vsm:text-sm vsm:font-light md:font-medium leading-[1.3]">
                Created By: {art?.creator}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
