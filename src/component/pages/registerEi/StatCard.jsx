import React from "react";

const StatCard = ({ title, value, onClick, bgColor, textColor }) => {
  return (
    <div
      className={`flex-1 p-6 rounded-lg shadow-md cursor-pointer ${bgColor} hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

export default StatCard;