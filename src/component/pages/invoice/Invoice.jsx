import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../template/Sidebar";
import axios from "axios";

const InvoicePage = ({ user, purchaseOrders = [] }) => {
  const location = useLocation();
  const { items } = location.state || { items: [] };
  const [selectedPO, setSelectedPO] = useState("");
  const [formItems, setFormItems] = useState(items);
  const [poData, setPoData] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [deliveredQuantities, setDeliveredQuantities] = useState({}); // State for delivered quantities
  const user1 = JSON.parse(localStorage.getItem("user"));
  const token = user1?.token;

  const handlePOChange = (event) => {
    const poId = event.target.value;
    setSelectedPO(poId);

    const selectedPOData = poData.find((po) => po.Ebeln === poId);
    setFormItems(selectedPOData ? [selectedPOData] : []);
    setDeliveredQuantities({}); // Reset delivered quantities when PO changes
  };

  useEffect(() => {
    const lifnr = user1?.lifnr;

    const fetchVendor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/vendors/vendor-id",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVendorDetails(response.data);
      } catch (error) {
        console.log("Error fetching vendor details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/po/getPoByLifnr/${lifnr}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPoData(response.data.length > 0 ? response.data[0] : []);
      } catch (error) {
        console.log("Error fetching purchase orders:", error);
      }
    };

    fetchVendor();
    fetchPo();
  }, []);

  const calculateTotal = () => {
    return formItems.reduce((total, item) => {
      const qty = parseFloat(deliveredQuantities[item.Ebelp] ?? 0); // Use delivered quantity
      const rate = parseFloat(item.Netpr ?? 0);
      return total + qty * rate;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPO || formItems.length === 0) {
      alert("Please select a purchase order.");
      return;
    }

    const invoiceData = {
      invoiceNumber,
      selectedPO,
      items: formItems.map((item) => ({
        ...item,
        deliveredQty: deliveredQuantities[item.Ebelp] || 0, // Include delivered quantity
      })),
      vendorDetails,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/invoice",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Invoice Submitted:", response.data);
      alert("Invoice submitted successfully!");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Error submitting invoice.");
    }
  };

  const subtotal = calculateTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex relative">
      <Sidebar user={user} />

      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="absolute top-4 right-8 flex items-center space-x-4">
          <select
            className="border px-4 py-2 rounded-lg"
            value={selectedPO}
            onChange={handlePOChange}
          >
            <option value="">Select PO</option>
            {poData.length > 0 &&
              poData.map((po, index) => (
                <option key={`${po.Ebeln}-${index}`} value={po.Ebeln}>
                  {po.Ebeln}
                </option>
              ))}
          </select>
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md ${
              !selectedPO || formItems.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleSubmit}
            disabled={!selectedPO || formItems.length === 0}
          >
            Submit Invoice
          </button>
        </div>

        <form
          className="container mx-auto max-w-5xl bg-white p-8 shadow-lg rounded-lg mt-16"
          onSubmit={handleSubmit}
        >
          <div className="justify-between items-center mb-6">
            <h1 className="text-4xl text-center font-bold text-[#3B71CA]">
              Invoice
            </h1>
            <p className="text-gray-600 text-center font-medium mt-2">
              <label className="mr-2 text-2xl">Invoice #: </label>
              <input
                type="text"
                className="px-4 rounded-lg font-medium"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {vendorDetails.length > 0 &&
              vendorDetails.map((vendor, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold">Billed To:</h3>
                  <p className="font-medium text-gray-700">{vendor.Name1}</p>
                  <p className="font-medium text-gray-700">{vendor.Adrnr}</p>
                  <p className="font-medium text-gray-700">
                    {vendor.Ort01}, {vendor.Regio}, {vendor.Pstlz}
                  </p>
                </div>
              ))}

            <div className="text-right">
              <h3 className="text-lg font-bold">Company Details:</h3>
              <p className="font-medium text-gray-700">
                Smart World Developers Pvt. Ltd.
              </p>
              <p className="font-medium text-gray-700">
                14th Floor, Tower 2, M3M
              </p>
              <p className="font-medium text-gray-700">
                Haryana, Gurugram, 122002
              </p>
            </div>
          </div>

          <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Item Code</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-right">Ordered Quantity</th>
                <th className="border px-4 py-2 text-right">Delivered Quantity</th>
                <th className="border px-4 py-2 text-right">Rate</th>
                <th className="border px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {formItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.Ebelp || ""}</td>
                  <td className="border px-4 py-2">{item.Txz01 || ""}</td>
                  <td className="border px-4 py-2 text-right">{item.Menge || ""}</td>
                  <td className="border px-4 py-2 text-right">
                    <input
                      type="number"
                      className="w-20 text-right border rounded-lg px-2 py-1"
                      value={deliveredQuantities[item.Ebelp] || ""}
                      onChange={(e) => {
                        const inputValue = parseFloat(e.target.value);
                        const deliveredQty = Math.max(
                          0,
                          Math.min(inputValue, item.Menge)
                        );
                        setDeliveredQuantities((prev) => ({
                          ...prev,
                          [item.Ebelp]: deliveredQty,
                        }));
                      }}
                      min={0} // Ensures the input cannot go below 0
                    />
                  </td>
                  <td className="border px-4 py-2 text-right">{item.Netpr || ""}</td>
                  <td className="border px-4 py-2 text-right">
                    ${(
                      parseFloat(item.Netpr || 0) *
                      parseFloat(deliveredQuantities[item.Ebelp] || 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between border-t pt-4">
                <span className="font-bold">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="font-bold">Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoicePage;