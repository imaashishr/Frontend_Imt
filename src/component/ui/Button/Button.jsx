import React from "react";

const Button = ({ 
    onClick,
    children,
    color = 'blue',
    size = 'medium',
    isDisabled = false,
 }) => {
    const baseStyles = 'w-full rounded-md text-white font-bold focus:outline-none transition duration-300';

  // Define size variations based on the 'size' prop
  const sizeStyles = size === 'small'
    ? 'px-4 py-2 text-sm'
    : size === 'large'
    ? 'px-6 py-3 text-lg'
    : 'px-5 py-2.5 text-base'; // default medium size

  // Define color variations based on the 'color' prop
  const colorStyles = color === 'blue'
    ? 'bg-blue-500 hover:bg-blue-600'
    : color === 'red'
    ? 'bg-red-500 hover:bg-red-600'
    : color === 'green'
    ? 'bg-green-500 hover:bg-green-600'
    : 'bg-gray-500 hover:bg-gray-600'; // Default to gray if no match

  // Disabled state styles
  const disabledStyles = isDisabled ? 'bg-gray-300 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles} ${colorStyles} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}

export default Button;