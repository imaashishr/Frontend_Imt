import React from "react";
import '../../custom css/VendorCard.css'; // Import the custom CSS for animations


const AsnCard = ({ asn, onClick, onDelete }) => {

  console.log("asncarddetails", asn);
  
  return (
    <div
      className="group bg-white shadow-xl rounded-lg p-6 cursor-pointer transform transition-transform hover:scale-105 relative w-[300px] h-[200px]" // Group class for hover effects
      onClick={onClick}
    >
      {/* Delete Button (Cross) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the onClick for opening the modal
          onDelete(asn.id); // Trigger delete on click
        }}
        className="absolute top-2 right-2 text-black font-bold text-xl"
      >
        &times;
      </button>

      {/* ASN Number with no hover effect */}
      <h3 className="asn-number text-xl font-semibold text-blue-600 mb-3">
  {asn?.asnId || "No ASN ID"}
</h3>

<p className="text-gray-700 mb-2">
  <strong>Delivery Date:</strong> {asn?.delivery_date || "N/A"}
</p>

<p className="text-gray-700 mb-2">
  <strong>Status:</strong> {"" || "Pending"}
</p>


      {/* Horizontal Curved Top Line */}
      <div className="top-line line"></div>

      {/* Horizontal Curved Bottom Line */}
      <div className="bottom-line line"></div>

      {/* Vertical Curved Lines */}
      <div className="right-line-1 line"></div>
      <div className="right-line-2 line"></div>
    </div>
  );
};

export default AsnCard;
