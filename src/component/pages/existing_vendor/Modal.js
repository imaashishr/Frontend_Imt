import React from "react";

const Modal = ({ vendor, onClose }) => {
  const handleClickInsideModal = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="modal-content bg-white p-8 rounded-lg shadow-lg w-4/5 md:w-1/3 max-h-screen overflow-auto"
        onClick={handleClickInsideModal}
      >
        <h2 className="text-2xl font-semibold text-blue-600">{vendor.Name1}</h2>
        <div className=" text-gray-700 pl-4 mt-3 space-y-1">
          <p>
            <strong>Email:</strong> {vendor.SmtpAddr}
          </p>
          <p>
            <strong>Mobile Number:</strong> {vendor.TelnrCall}
          </p>
          <p>
            <strong>GSTIN/UIN:</strong> {vendor.Stcd3}
          </p>
          <p>
            <strong>PAN Number:</strong> {vendor.Zpan}
          </p>
          <p>
            <strong>Address:</strong> {vendor.Adrnr}
          </p>
          <p>
            <strong>City:</strong> {vendor.Ort01}
          </p>
          <p>
            <strong>State:</strong> {vendor.Regio}
          </p>
          <p>
            <strong>Country:</strong> {vendor.Country}
          </p>
        </div>

        <button
          className="mt-4 text-white bg-blue-600 p-2 rounded-lg"
          onClick={onClose} 
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
