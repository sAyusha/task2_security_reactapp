import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { UserContext } from "../../context/UserContext";

const IndividualSavedArt = ({ artId }) => {
  const [art, setArt] = useState([]);
  const [isSaved, setIsSaved] = useState(true);
  const { user: currentUser, setUser } = useContext(UserContext);
  const [artOwner, setArtOwner] = useState({});

  // const artId = artt.data ? artt.data[0]?._id : "";

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/api/users/${artId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((res) => {
  //       setArtOwner(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [artId]);

  // console.log(artOwner);

  // useEffect(() => {
  //   if (currentUser) {
  //     //   setIsSaved(currentUser.savedPosts.includes(art._id));
  //   }
  // }, [currentUser, art._id]);

  useEffect(() => {
    if (currentUser) {
      setIsSaved(currentUser?.data[0].savedArts.includes(artId));
    }
  }, [currentUser, artId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/arts/${artId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setArt(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [artId]);

  const removeSave = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      // const id = art.data[0]?.id;
      if (!token) {
        // Handle case when user is not logged in
        return;
      }
      if (isSaved) {
        // Remove saved art
        await axios.delete(`http://localhost:3001/api/arts/save/${artId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser((prevUser) => {
          const updatedSavedArts =
            prevUser?.data[0].savedArts.filter(
              (artid) => artid !== artId
            );
          return {
            ...prevUser,
            data: [
              {
                ...prevUser.data[0],
                savedArts: updatedSavedArts,
              },
            ],
          };
        });
        setIsSaved(false);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  return (
    <div
      className="cursor-pointer relative w-fit bg-blue-dark dark:bg-black-75 rounded-lg flex pb-4 flex-col gap-4 transition duration-200"
      onClick={() => {
        window.location.href = `/art-details/${art.data[0]?.id}`;
      }}
    >
      <button className="absolute top-3 right-2" onClick={removeSave}>
        {isSaved ? (
          <BsBookmarkFill className="w-5 h-5 cursor-pointer text-white transition duration-300" />
        ) : (
          <div className="rounded-[50px] border border-light-color p-2 bg-light-color">
            <BsBookmark className="w-5 h-5 cursor-pointer text-white transition duration-300" />
          </div>
        )}
      </button>

      <img
        src={
          art.data
            ? `http://localhost:3001/uploads/${art.data[0]?.image}`
            : "https://odessa-journal.com/public/oj/img/default-image.jpg"
        }
        alt=""
        className="border border-light-slate rounded-lg w-[500px] h-[250px] md:w-[500px] md:h-[250px] vsm:w-100vw vsm:h-100vh object-fill"
      />

      <div className="flex flex-col gap-1">
        <p className="text-sm text-white text-center font-medium leading-[1.3] max-w-100vh text-ellipsis overflow-hidden">
          {art.data ? art.data[0]?.title : ""}
        </p>

        <p className="text-sm text-white text-center font-light leading-[1.3]">
          Creator: {art.data ? art.data[0]?.creator : ""}
        </p>

        <div className="flex justify-center items-center gap-1 mt-1">
          <p className="text-xs text-pale-yellow"> StartingBid: {art.data ? art.data[0]?.startingBid : ""}$
</p>
        </div>
      </div>
    </div>
  );
};

export default IndividualSavedArt;
