const Button = ({ btnName, activeButton, handleButtonClick }) => {
    return (
      <button
        className={`${
          activeButton === btnName
            ? "text-white bg-blue-dark dark:text-black dark:bg-pink-light"
            : "bg-light-slate text-black"
        } font-medium mt-2 vsm:text-sm md:text-lg rounded-3xl hover:bg-light-color md:px-4 py-1 vsm:px-2 vsm:min-w-[50px]`}
        onClick={() => handleButtonClick(btnName)}
      >
        {btnName}
      </button>
    );
  };
  
  export default Button;
  