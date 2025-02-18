import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../template/Sidebar";

const PoItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const po = state?.po;

  console.log(po);

  const vendor = JSON.parse(localStorage.getItem("user"));
  const token = vendor?.token;

  const [poItems, setPoItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [eiData, setEiData] = useState([]); // State for ei data

  useEffect(() => {
    if (!po || !po.Ebeln) {
      setError("Invalid PO data or missing Ebeln.");
      setLoading(false);
      return;
    }

    const fetchPoItems = async () => {
      try {
        if (!po.lineItems || po.lineItems.length === 0) {
          const response = await axios.get(
            `http://localhost:4000/api/po/getPoItems/${po.Ebeln}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("API Response:", response.data[0]);
          setPoItems(response.data[0]);
        } else {
          setPoItems(po.lineItems);
        }
      } catch (error) {
        setError("Error fetching PO items");
        console.error("Error fetching PO items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/ei/get-ei"
        );
        console.log("Api get ei response:", response.data);
        setEiData(response.data); // Store EI data in the state
      } catch (error) {
        console.error("Error fetching EI:", error);
      }
    };

    fetchEi();
    fetchPoItems();
  }, [po, token]);

  const handleSelectItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, item]
    );
  };

  const handleGenerateASN = () => {
    const itemsForASN = selectedItems.map((item) => ({
      code: item.Ebeln,
      description: item.Txz01,
      orderedQty: item.Menge,
      deliveryDate: item.deliveryDate,
      deliveredQty: item.deliveredQty,
    }));
    navigate("/asn-form", { state: { po, items: itemsForASN } });
  };

  const handleGenerateInvoice = () => {
    if (!invoiceNumber) {
      alert("Please provide an invoice number.");
      return;
    }
    navigate("/invoice", { state: { items: selectedItems, invoiceNumber } });
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((selected) => selected !== option)
        : [...prev, option]
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-blue-600">
        Loading PO Items...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar user={vendor} />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-blue-600 mb-2">
            Purchase Order: <span className="text-blue-800">{po.Ebeln}</span>
          </h1>
          <h2 className="text-xl md:text-3xl font-medium text-center text-gray-700">
            Vendor: <span className="text-gray-800">{vendor.name}</span> /{" "}
            <span className="text-gray-800">{vendor.lifnr}</span>
          </h2>

          <div className="overflow-x-auto mt-10 max-h-[450px]">
            <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="my-4">
                  <th className="py-4">Select</th>
                  <th className="py-4">Item Code</th>
                  <th className="py-4">Description</th>
                  <th className="py-4">Ordered Quantity</th>
                  <th className="py-4">UOM</th>
                  <th className="py-4">Rate</th>
                  <th className="py-4">Date of Delivery</th>
                  <th className="py-4">Delivered Quantity</th>
                  <th className="py-4">Short Close</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="max-h-80 overflow-y-auto">
                {poItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        onChange={() => handleSelectItem(item)}
                        checked={selectedItems.some(
                          (selected) => selected.id === item.id
                        )}
                      />
                    </td>
                    <td className="px-6 py-4">{item.Ebelp}</td>
                    <td className="px-6 py-4">{item.Txz01}</td>
                    <td className="px-6 py-4">{item.Menge}</td>
                    <td className="px-6 py-4">{item.Meins}</td>
                    <td className="px-6 py-4">{item.Netpr}</td>
                    <td className="px-6 py-4">{item.deliveryDate}</td>
                    <td className="px-6 py-4">{item.deliveredQty}</td>
                    <td className="px-6 py-4">
                      {item.shortClose ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleGenerateASN}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!selectedItems.length}
          >
            Generate ASN
          </button>

          <button
            onClick={handleGenerateInvoice}
            className="mt-6 ml-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={!selectedItems.length || !invoiceNumber}
          >
            Generate Invoice
          </button>

          {/* Dropdown - Positioned to the right */}
          {vendor.role === "Ei" && (
          <div className="absolute w-56 top-16 right-4">
            <button
              className="px-4 py-2 w-56 bg-gray-300 text-gray-700 rounded-lg"
              onClick={toggleDropdown}
            >
              Select Approval
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 w-56 bg-white border rounded-lg shadow-md">
                {eiData.map((option) => (
                  <label key={option.id} className="block px-4 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.Name1)} // Using Name1 for checkbox label
                      onChange={() => handleCheckboxChange(option.Name1)} // Use Name1 as the unique value for selection
                      className="mr-2"
                    />
                    {option.Name1} {/* Show Name1 from EI data */}
                  </label>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoItems;
