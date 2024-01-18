import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const PaymentSummaryModal = ({
  artDetail,
  artOwner,
  amount,
  orderId,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track whether the modal is open
  const [payLoad, setPayLoad] = useState({}); // State to store the payload from Khalti Checkout

  const handleAddressClick = () => {
    setIsModalOpen(true); // Open the modal when "Make a Bid" button is clicked
  };

  console.log(orderId);

  const handlePaymentVerification = (payload) => {
    setPayLoad(payload);
    console.log(payload);

    // Assuming you have the token stored in the state or as a prop
    const token = localStorage.getItem("token");

    axios
      .put(
        `http://localhost:3001/api/orders/${orderId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let config = {
    publicKey: "test_public_key_59f37294097b46608dc810d923003d0a",
    productIdentity: "1234567890",
    productName: "Drogon",
    productUrl: "http://gameofthrones.com/buy/Dragons",
    eventHandler: {
      onSuccess: handlePaymentVerification,
      // onError handler is optional
      onError(error) {
        // handle errors
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS"],
  };

  return (
    <div className="bg-[#000000cb] text-white fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
      <button className="absolute top-3 right-4 hover:bg-[#cc0000]">
        <IoClose onClick={onClose} className="w-7 h-7 text-white" />
      </button>

      <div className="bg-pink-light w-[30%] p-4 rounded-lg">
        <h3 className="noto-serif text-xl font-semibold text-black text-center mb-4">
          Payment Summary
        </h3>
        <img
          src={`http://localhost:3001/uploads/${artDetail[0]?.image}`}
          alt=""
          className="w-full h-60 object-contain mb-4 rounded-lg"
        />
        <h3 className="text-xl font-semibold text-black mb-1">
          {artDetail[0]?.title}
        </h3>
        <div className=" border-b-2 border-light-color mb-1"></div>
        <div className="flex flex-row justify-between text-black">
          <p className="mb-2">Subtotal: </p>
          <p className="mb-2">{amount}$ </p>
        </div>
        <div className="flex flex-row justify-between text-black">
          <p className="mb-2">Shipping Fees: </p>
          <p className="mb-2">0.00$ </p>
        </div>
        <div className="flex flex-row justify-between text-black">
          <p className="mb-2">Total Fees: </p>
          <p className="mb-2">{amount}$ </p>
        </div>
        {/* <p className="mb-2">Other order summary details go here...</p> */}
        {/* <button
          className="bg-blue-dark py-2 px-4 text-white rounded-lg w-full font-semibold"
          style={{ letterSpacing: 2 }}
        >
          CONFIRM
        </button> */}
        <button
          id="payment-button"
          className="text-black font-semibold"
          onClick={(e) => {
            e.preventDefault();
            let checkout = new KhaltiCheckout(config);
            checkout.show({ amount: amount * 100 });
          }}
        >
          Pay with Khalti
        </button>
      </div>
    </div>
  );
};

export default PaymentSummaryModal;
