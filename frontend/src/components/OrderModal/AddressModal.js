import axios from "axios";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";
import PaymentSummaryModal from "./PaymentSummaryModal";

export default function AddressModal({ artDetail, artOwner, amount, onClose }) {
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [paymentOption, setPaymentOption] = useState("COD"); // Updated state to hold a single value
  const [request, setRequest] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Options for the payment options dropdown
  const paymentOptions = ["COD", "Khalti"];

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const handlePostalCode = (e) => {
    setPostalCode(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handlePaymentOption = (e) => {
    setPaymentOption(e.target.value);
  };

  const handleRequest = (e) => {
    setRequest(e.target.value);
  };

  const handleReset = () => {
    setAddress("");
    setPostalCode("");
    setCity("");
    setPaymentOption("");
    setRequest("");
    setError("");
    setMessage("");
  };

  const handlePayment = async () => {
    if (paymentOption === "COD") {
      setError("");
      setMessage("");

      const artId = "YOUR_ART_ID"; // Replace with the actual art ID
      const bidAmount = 123; // Replace with the actual bid amount

      try {
        const response = await fetch(`/api/${artId}/bid`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Assuming you have an authentication token to identify the user
            Authorization: "Bearer YOUR_AUTH_TOKEN",
          },
          body: JSON.stringify({ bidAmount }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Bid placed successfully");
          console.log("Bid placed successfully:", data);
          // Handle success, e.g., show a success message or update the UI
        } else {
          setError("Failed to place bid");
          console.error("Failed to place bid:", data);
          // Handle error, e.g., show an error message or update the UI
        }
      } catch (error) {
        setError("Failed to place bid");
        console.error("Failed to place bid:", error);
        // Handle error, e.g., show an error message or update the UI
      }
    } else if (paymentOption === "Khalti") {
      // Redirect the user to the page that has "Khalti payment details"
      // You can implement your own logic for this redirection
      console.log("Redirect to Khalti payment details page");
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      } else {
        const orderItems = [
          {
            artId: artDetail[0]?.id, // Replace with the correct art ID
            title: artDetail[0]?.title, // Replace with the correct title
            description: artDetail[0]?.description, // Replace with the correct description
            image: artDetail[0]?.image, // Replace with the correct image URL
            quantity: 1,
          },
        ];

        const data = {
          orderItems,
          shippingAddress: {
            // fullname: artOwner[0]?.fullname,
            address,
            postalCode,
            city,
            request,
          },
          bidAmount: amount,
          totalAmount: amount,
          shippingPrice: 0, // Replace with the correct shipping price if applicable
          paymentOption,
          request,
        };

        const response = await axios.post(
          `https://localhost:3001/api/orders/${artDetail[0]?.id}/order`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsLoading(false);
        console.log(response.data);
        setMessage("Order placed successfully");
        setIsModalOpen(true);
        console.log(response.data.data.id);
        setOrderId(response.data.data.id);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="bg-[#000000cb] text-white fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
      <div className="relative my-10 mx-5 bg-blue-dark p-4 rounded-xl shadow dark:bg-gray-700">
        <button className="absolute hover:bg-pale-red top-3 right-4">
          <IoClose onClick={onClose} className="w-7 h-7 text-white" />
        </button>

        {error && <span className="text-pale-red">{error}</span>}

        {message && <span className="text-lime-green">{message}</span>}

        {errorMessage && <span className="text-pale-red">{errorMessage}</span>}

        <h3 className="noto-serif text-xl font-semibold text-white text-center mb-4">
          Shipping Details
        </h3>

        <p>Fill up your shipping details.</p>
        <form className="my-6 grid grid-cols-1 gap-y-4 text-black md:grid-cols-3 md:gap-x-4 md:gap-y-6">
          <TextFieldWithLabel
            label="Address"
            type="text"
            placeholder="Enter your address"
            onChange={handleAddress}
          />

          <TextFieldWithLabel
            label="Postal Code"
            type="text"
            placeholder="Enter postal code"
            onChange={handlePostalCode}
          />

          <TextFieldWithLabel
            label="City"
            type="text"
            placeholder="Enter city"
            onChange={handleCity}
          />

          <div className="flex flex-col items-baseline gap-2">
            <label className="font-semibold">Payment Option</label>
            <select
              value={paymentOption}
              onChange={handlePaymentOption}
              className="block w-full bg-gray-100 dark:bg-black border border-light-color dark:border-white text-black py-4 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {paymentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <TextFieldWithLabel
            label="Request"
            type="text"
            placeholder="Enter your request"
            onChange={handleRequest}
          />

          {isModalOpen && (
            <PaymentSummaryModal
              artDetail={artDetail}
              // artOwner={artOwner}
              amount={amount}
              orderId={orderId}
              onClose={() => setIsModalOpen(false)} // Close the modal when the close button is clicked
            />
          )}

          <div className="flex flex-col items-center justify-center md:col-span-3">
            <button
              type="submit"
              className="w-full mt-2 bg-pink-light dark:bg-purple-lighter text-black text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-2 hover:font-bold"
              style={{ letterSpacing: "2px" }}
              onClick={handleOrder}
            >
              {isLoading ? "Loading..." : "ORDER"}
            </button>

            <button
              type="button"
              className="w-full mt-2 bg-pink-light dark:bg-dark-slate text-black text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-4 hover:font-bold"
              style={{ letterSpacing: "2px" }}
              onClick={handleReset}
            >
              RESET
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}