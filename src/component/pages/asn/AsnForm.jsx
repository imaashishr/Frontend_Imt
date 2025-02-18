import React, { useState, useEffect } from "react";
import Sidebar from "../../template/Sidebar"; // Import Sidebar for the details page
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation for accessing location
import axios from "axios"; // Import axios for HTTP requests

const AsnForm = ({ user }) => {
  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // Get the navigate function
  const user1 = JSON.parse(localStorage.getItem("user")); 
  console.log("userhjsdagjhsagfk", user1.id)
  // Safely access the passed state with a fallback value
  const { po, items = [] } = location.state || {}; // Destructure po and items
  const poNumber = po?.Ebeln || ""; // Safely access poNumber from po, if po exists

  // Initialize ASN data state
  const [asnData, setAsnData] = useState({
    deliveryDate: "", // Dummy delivery date (ETA)
    documentDate: new Date().toISOString().split("T")[0], // Current date
    shipFrom: "",
    shipTo: "",
    ebayBillNumber: "",
    transporter: "",
    incoterm: "",
    totalQuantity: "",
    purchaseDocumentNumber: poNumber, // Pre-fill with PO number
  });

  // State for tracking delivered quantities for each item
  const [deliveredQuantities, setDeliveredQuantities] = useState(
    items.reduce((acc, item) => {
      acc[item.id] = item.deliveredQty || 0; // Initialize with existing delivered quantity or 0
      return acc;
    }, {})
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsnData({
      ...asnData,
      [name]: value,
    });
  };

  const handleDeliveredQtyChange = (id, value) => {
    setDeliveredQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload for API
    const payload = {
      deliveryDate: asnData.deliveryDate,
      documentDate: asnData.documentDate,
      shipFrom: asnData.shipFrom,
      shipTo: asnData.shipTo,
      ebayBillNumber: asnData.ebayBillNumber,
      transporter: asnData.transporter,
      incoterm: asnData.incoterm,
      totalQuantity: asnData.totalQuantity,
      Lifnr:user1.id,
      purchaseDocumentNumber: asnData.purchaseDocumentNumber,
      items: items.map((item) => ({
        itemId: item.id,
        orderedQty: item.orderedQty,
        deliveredQty: deliveredQuantities[item.id] || 0,
      })),
    };

    try {
      // Send data to the API
      const response = await axios.post("http://localhost:4000/api/asn/register-asn", payload);
      console.log("ASN registered successfully:", response.data);

      // Redirect after successful submission
      navigate("/asn"); // Adjust the path as needed
    } catch (error) {
      console.error("Error registering ASN:", error);
      alert("There was an error submitting the ASN. Please try again later.");
    }
  };

  useEffect(() => {
    // Only calculate total quantity if items are available
    if (items.length > 0) {
      const totalQty = items.reduce(
        (sum, item) => sum + (deliveredQuantities[item.id] || 0),
        0
      );
      setAsnData((prevState) => ({
        ...prevState,
        totalQuantity: totalQty,
      }));
    }
  }, [deliveredQuantities, items]);

  return (
    <div className="flex">
      <Sidebar user={user} /> {/* Safely pass user info to Sidebar */}

      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-center text-[#3B71CA] mb-8">Create ASN</h1>

          {/* ASN Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold text-blue-600">ASN Header</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700">Purchase Document Number</label>
                <input
                  type="text"
                  name="purchaseDocumentNumber"
                  value={poNumber} // Use the correct poNumber
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Delivery Date (ETA)</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={asnData.deliveryDate}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Document Date</label>
                <input
                  type="date"
                  name="documentDate"
                  value={asnData.documentDate}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Ship From</label>
                <input
                  type="text"
                  name="shipFrom"
                  value={asnData.shipFrom}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Ship To</label>
                <input
                  type="text"
                  name="shipTo"
                  value={asnData.shipTo}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Transporter</label>
                <input
                  type="text"
                  name="transporter"
                  value={asnData.transporter}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-blue-600">Item Data</h2>
            <div className="overflow-x-auto mt-10 max-h-[450px]">
              <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                <thead>
                  <tr>
                    <th className="py-4">Item Code</th>
                    <th className="py-4">Description</th>
                    <th className="py-4">Ordered Quantity</th>
                    <th className="py-4">Delivered Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No items available</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">{item.code}</td>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">{item.orderedQty}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={deliveredQuantities[item.id] || 0}
                            onChange={(e) => handleDeliveredQtyChange(item.id, e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Delivered Quantity"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit ASN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AsnForm;
