import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";


export default function NotificationBody() {
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const { user } = useContext(UserContext);

  const [bidStatus, setBidStatus] = useState("pending");

  useEffect(() => {
    // Fetch bids from the API
    axios
      .get(`https://localhost:3001/api/bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBids(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // Fetch user's orders from the API
    axios
      .get(`https://localhost:3001/api/orders/mine`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredPaidOrders = orders.filter((order) => order.isPaid === true);

  console.log(bids);

  const findWinningBid = (artId) => {
    const artBids = bids.filter((bid) => bid.bidArt[0].includes(artId[0].id));
    console.log(artBids);
    if (artBids.length === 0) {
      return null; // No bids for this art
    }

    // Find the bid with the highest bidAmount
    const winningBid = artBids.reduce((prev, current) =>
      prev.bidAmount > current.bidAmount ? prev : current
    );

    return winningBid;
  };

  console.log(filteredPaidOrders);

  return (
    <div className="mt-10 mb-14 flex flex-col gap-4">
      {user ? (
        <>
          {filteredPaidOrders.length === 0 && (
            <div className="mt-2">
              <p className="font-medium text-pale-red">
                No new <span className="font-bold">notifications</span> available.
              </p>
            </div>
          )}

          {filteredPaidOrders.map((order) => {
            // Find the winning bid for this order's art
            const winningBid = findWinningBid(
              order.orderItems.map((item) => item.art)
            );

            console.log(winningBid);

            return (
              <div
                className=" flex flex-col m-auto p-[1.5rem] w-[80%] border-2 rounded-2xl border-light-slate"
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                key={order._id}
              >
                {winningBid && winningBid.user === order.user ? (
                  <p className="noto-serif text-lime-green text-lg font-semibold leading-[1.3]">
                    You are currently winning the bid!
                  </p>
                ) : (
                  <p className="noto-serif text-pale-red text-lg font-semibold leading-[1.3]">
                    You are being outbid!
                  </p>
                )}

                <div className="w-full border-b border-light-color"></div>
                <div className="flex flex-row pt-4 gap-2 md:flex-row vsm:flex-col w-full">
                  <img
                    src={order.orderItems.map(
                      (item) => `https://localhost:3001/uploads/${item.image}`
                    )}
                    className="md:w-[250px] w-[250px] vsm:w-full rounded-lg h-[250px] object-fill"
                    alt="img"
                  />
                  <div className="flex flex-col vsm:gap-2 md:gap-4 md:pl-10 md:pt-5">
                    <h3 className="vsm:text-sm text-[21px] text-black dark:text-white font-semibold md:text-2xl leading-[1.3] text-ellipsis">
                      {order.orderItems.map((item) => (
                        <p>{item.title}</p>
                      ))}
                    </h3>

                    <p className="text-medium font-medium md:text-lg text-black dark:text-white vsm:text-sm vsm:font-light md:font-medium leading-[1.3]">
                      {order.orderItems.map((item) => (
                        <p>{item.description}</p>
                      ))}
                    </p>
                    {winningBid && winningBid.user === order.user ? (
                      <button className="bg-blue-dark rounded-lg p-2 hover:font-bold text-white">
                        Get Delivery
                      </button>
                    ) : (
                      <button className="bg-blue-dark rounded-lg p-2 hover:font-bold text-white">
                        Rebid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="font-medium text-center md-2:text-lg">
            You are not <span className="text-pale-red font-bold">logged in.</span>
          </p>

          <a
            href="/login"
            className="text-white text-lg font-medium bg-pale-red hover:bg-blue-dark py-2 px-8 rounded-lg cursor-pointer transition duration-300"
          >
            Log In
          </a>
        </div>
      )}

    </div>
  );
}
