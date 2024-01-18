import React, { useState } from "react";

const TextFieldWithLabel = ({
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  className,
}) => {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.trim() === "") {
      setError("Required");
    } else {
      setError("");
    }

    onChange(e);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={label} className="font-semibold dark:text-white">
        {label}
        {error && (
          <span className="text-sm font-medium text-pale-red">
            {" "}
            ({error})
          </span>
        )}
      </label>

      <div className="p-4 bg-white dark:bg-black flex items-center gap-2 mb-2 border border-light-color dark:border-white dark:text-white transition-all duration-200 ease-linear hover:border-pink-light focus:border-pink-light">
        <input
          type={type}
          id={label}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="flex-1 outline-none rounded-[3px] text-[13px]placeholder:text-light-slate dark:bg-black dark:text-white"
        />

        {Icon && <Icon className="text-xl text-dark-slate dark:text-white" />}
      </div>
    </div>
  );
};

export default TextFieldWithLabel;
