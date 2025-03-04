import React from "react";

const VendorCard = ({ vendorId, totalInvoices, pendingInvoices, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-lg rounded-lg p-4 w-[300px] border border-gray-200 cursor-pointer hover:shadow-xl transition duration-300"
    >
      <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg font-semibold">
        Vendor ID: {vendorId}
      </div>

      <div className="grid grid-cols-2 text-center py-4">
        <div className="text-lg font-bold text-gray-700">
          <p>Total</p>
          <p className="text-blue-600">{totalInvoices}</p>
        </div>
        <div className="text-lg font-bold text-gray-700">
          <p>Pending</p>
          <p className="text-red-500">{pendingInvoices}</p>
        </div>
      </div>
    </div>
  );
};
          
export default VendorCard;
