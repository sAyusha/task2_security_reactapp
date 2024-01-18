const Button = ({ btnName, activeButton, handleButtonClick }) => {
  return (
    <button
      className={`${
        activeButton === btnName
          ? "text-black dark:text-white"
          : "bg-none text-dark-slate"
      } font-semibold mt-2 vsm:text-sm md:text-xl rounded-[2px] vsm:px-2 vsm:min-w-[50px]`}
      onClick={() => handleButtonClick(btnName)}
    >
      {btnName}
    </button>
  );
};

export default Button;
