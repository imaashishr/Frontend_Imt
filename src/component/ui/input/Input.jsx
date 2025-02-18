// CustomInput.js
import React from 'react';

const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  name,
  size = 'medium', // Default to 'medium'
  isError,
  errorMessage,
  isDisabled = false, // Default to not disabled
}) => {
  // Define base styles for the input
  const baseStyles = 'block w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 transition duration-200';

  // Determine the size based on the `size` prop
  const sizeStyles = size === 'small'
    ? 'p-2 text-sm'
    : size === 'large'
    ? 'p-4 text-xl'
    : 'p-3 text-lg'; // default medium size

  // Determine the border color based on `isError` prop
  const borderColor = isError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#036491]';

  // Handle disabled state
  const disabledStyles = isDisabled ? 'bg-gray-200 cursor-not-allowed' : '';

  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        disabled={isDisabled}
        className={`${baseStyles} ${sizeStyles} ${borderColor} ${disabledStyles}`}
      />
      {isError && errorMessage && (
        <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default Input;
