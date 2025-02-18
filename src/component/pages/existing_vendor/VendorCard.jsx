import React from 'react';
import '../../custom css/VendorCard.css'; 

const VendorCard = ({ vendor, onClick}) => {
  return (
    <div
      className="group bg-white shadow-xl rounded-lg p-6 cursor-pointer transform transition-transform hover:scale-105 relative w-[300px] h-[200px]" 
      onClick={onClick}
    >
  
      <h3 className="vendor-name text-xl font-semibold text-blue-600 mb-3">
        {vendor.Lifnr}:{vendor.Name1}
      </h3>

      <p className="text-gray-700 mb-2">
        <strong>Address:</strong> {vendor.Adrnr}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Mobile:</strong> {vendor.TelnrCall}
      </p>

      <div className="top-line line"></div>

      <div className="bottom-line line"></div>

      <div className="right-line-1 line"></div>
      <div className="right-line-2 line"></div>
    </div>
  );
};

export default VendorCard;