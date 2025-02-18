// CustomDropdown.js
import React from "react";

const Dropdown = ({
  value,
  onChange,
  options = [], // Default to empty array if options is undefined
  placeholder = "Select an option",
  size = "medium",
  isError,
  errorMessage,
  isDisabled = false,
  name,
}) => {
  const baseStyles =
    "block w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 transition duration-200";

  const sizeStyles =
    size === "small"
      ? "p-2 text-sm"
      : size === "large"
      ? "p-4 text-xl"
      : "p-3 text-lg";

  const borderColor = isError
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-[#036491]";

  const disabledStyles = isDisabled ? "bg-gray-200 cursor-not-allowed" : "";

  return (
    <div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || "")} // Ensure it doesn't break on undefined
        name={name}
        disabled={isDisabled}
        className={`${baseStyles} ${sizeStyles} ${borderColor} ${disabledStyles}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isError && errorMessage && (
        <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default Dropdown;
