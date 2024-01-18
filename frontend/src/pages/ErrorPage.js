import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <img
          src="https://cdn.dribbble.com/users/1363329/screenshots/4341760/media/98f69341ea4a1d70e6f95d92203bc796.jpg?resize=400x0&vertical=center"
          alt=""
        />
        <p className="text-error-red font-semibold text-xl mb-2">
          Access Denied
        </p>
        <p className="text-black-75 font-medium">
          You currently don't have access to this page
        </p>
        <p className="font-medium text-center text-black-75 mb-4">
            Please go back to the login page.
        </p>
        <a
          href="/login"
          className="text-white text-lg font-medium bg-error-red hover:bg-blue-dark py-2 px-8 rounded-lg cursor-pointer transition duration-300"
        >
          Log In
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
