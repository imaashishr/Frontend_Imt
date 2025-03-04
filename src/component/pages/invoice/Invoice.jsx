import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../template/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoicePage = ({ user, purchaseOrders = [] }) => {
  const location = useLocation();
  const { items } = location.state || { items: [] };
  const [selectedPO, setSelectedPO] = useState("");
  const [formItems, setFormItems] = useState(Array.isArray(items) ? items : []);
  const [poData, setPoData] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [supplyMonth, setSupplyMonth] = useState("");
  // const [contactPerson, setContactPerson] = useState("");
  // const [contactNo, setContactNo] = useState("");
  // const [state, setState] = useState("");
  // const [stateCode, setStateCode] = useState("");
  const [irnNo, setIrnNo] = useState("");
  const [ackNo, setAckNo] = useState("");
  const [deliveredQuantities, setDeliveredQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const tokenRef = useRef(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).token
      : null
  );
  const userRef = useRef(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const handlePOChange = (event) => {
    const poId = event.target.value;
    setSelectedPO(poId);

    const selectedPOData = poData.find((po) => po.Ebeln === poId);
    setFormItems(selectedPOData ? [selectedPOData] : []);
    setDeliveredQuantities({});
    setSelectedItems({});
  };

  useEffect(() => {
    const fetchVendorAndPO = async () => {
      if (!tokenRef.current) {
        console.error("No token found. Please log in.");
        toast.error("No token found. Please log in.");
        return;
      }

      const lifnr = userRef.current?.lifnr;

      console.log(">>>>>>>>>>",lifnr);
      try {
        const [vendorRes, poRes] = await Promise.all([
          axios.get("http://localhost:4000/api/vendors/:Lifnr", {
            headers: { Authorization: `Bearer ${tokenRef.current}` },
          }),
          axios.get(`http://localhost:4000/api/po/getPoByLifnr/${lifnr}`, {
            headers: { Authorization: `Bearer ${tokenRef.current}` },
          }),
        ]);

        setVendorDetails(vendorRes.data[0]);
        setPoData(poRes.data[0] || []);

        console.log(">>>>>>>>>.",vendorRes.data);
      } catch (error) {
        console.error("Error fetching vendor/PO details:", error);
        toast.error("Error fetching vendor/PO details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorAndPO();
  }, []);

  useEffect(() => {
    if (!selectedPO || !tokenRef.current) return;

    const fetchPoItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/po/getPoItems/${selectedPO}`,
          {
            headers: { Authorization: `Bearer ${tokenRef.current}` },
          }
        );

        if (Array.isArray(response.data)) {
          const itemsArray = response.data;
          const uniqueItems = Array.from(
            new Map(
              itemsArray.map((item) => [
                `${item.Ebeln}-${item.Ebelp}-${item.Txz01}`,
                item,
              ])
            ).values()
          );
          console.log("Items>>>>>>>",uniqueItems);
          setFormItems(uniqueItems);
        } else if (response.data.items && Array.isArray(response.data.items)) {
          const itemsArray = response.data.items;
          const uniqueItems = Array.from(
            new Map(
              itemsArray.map((item) => [
                `${item.Ebeln}-${item.Ebelp}-${item.Txz01}`,
                item,
              ])
            ).values()
          );
          setFormItems(uniqueItems);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setFormItems([]);
        }
      } catch (error) {
        console.error("Error fetching PO items:", error);
        toast.error("Error fetching PO items.");
      }
    };

    fetchPoItems();
  }, [selectedPO]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const calculateTotal = () => {
    if (!Array.isArray(formItems)) {
      console.error("formItems is not an array:", formItems);
      return 0;
    }
    return formItems.reduce((total, item) => {
      if (selectedItems[item.Ebelp]) {
        const qty = parseFloat(deliveredQuantities[item.Ebelp] ?? 0);
        const rate = parseFloat(item.Netpr ?? 0);
        const cgst = parseFloat(item.CGST ?? 0);
        const sgst = parseFloat(item.SGST ?? 0);
        const igst = parseFloat(item.IGST ?? 0);
        const itemTotal = qty * rate;
        const gstTotal = (itemTotal * (cgst + sgst + igst)) / 100;
        return total + itemTotal + gstTotal;
      }
      return total;
    }, 0);
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(formItems)) {
      console.error("formItems is not an array:", formItems);
      return 0;
    }

    return formItems.reduce((total, item) => {
      if (selectedItems[item.Ebelp]) {
        const qty = parseFloat(deliveredQuantities[item.Ebelp] ?? 0);
        const rate = parseFloat(item.Netpr ?? 0);
        const itemTotal = qty * rate;
        return total + itemTotal;
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPO || formItems.length === 0) {
      toast.error("Please select a purchase order.");
      return;
    }

    const selectedItemsArray = formItems.filter(
      (item) => selectedItems[item.Ebelp]
    );

    if (selectedItemsArray.length === 0) {
      toast.error("Please select at least one item.");
      return;
    }

    const invoiceData = {
      invoiceNumber,
      invoiceDate,
      supplyMonth,
      contactPerson: vendorDetails.Name1 || null,
      contactNo: vendorDetails.TelnrCall || null,
      state: vendorDetails.Stras || null,
      stateCode: vendorDetails.Adrnr || null,
      irnNo,
      ackNo,
      selectedPO,
      ei_ID: "EI0003",
      status: "pending",
      items: selectedItemsArray.map((item) => ({
        ...item,
        deliveredQty: deliveredQuantities[item.Ebelp] || 0,
      })),
      vendorDetails,
    };
    console.log("Vendor Details Structure:", vendorDetails);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/invoices",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
          },
        }
      );
      console.log("Invoice Submitted:", response.data);
      toast.success("Invoice submitted successfully!");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Error submitting invoice.");
    }
  };

  const total = calculateTotal();
  const subtotal = calculateSubtotal();

  return (
    <div className="flex relative">
      <Sidebar user={user} />
      <ToastContainer />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="absolute top-4 right-8 flex items-center space-x-4">
          <select
            className="border px-4 py-2 rounded-lg"
            value={selectedPO}
            onChange={handlePOChange}
          >
            <option value="">Select PO</option>
            {poData.length > 0 ? (
              poData.map((po, index) => (
                <option key={`${po.Ebeln}-${index}`} value={po.Ebeln}>
                  {po.Ebeln}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No POs available
              </option>
            )}
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
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.keys(vendorDetails).length > 0 && (
  <div>
    <h3 className="text-lg font-bold">Billed To:</h3>
    <p className="font-bold text-gray-700">{vendorDetails.Name1}</p>
    <p className="font-bold text-gray-700">{vendorDetails.Adrnr}</p>
    <p className="font-bold text-gray-700">
      {vendorDetails.Stras}, {vendorDetails.Regio}, {vendorDetails.Pstlz}
    </p>
  </div>
)}

            <div className="text-right">
              <h3 className="text-lg font-bold">Company Details:</h3>
              <p className="font-bold text-gray-700">
                Smart World Developers Pvt. Ltd.
              </p>
              <p className="font-bold text-gray-700">
                14th Floor, Tower 2, M3M
              </p>
              <p className="font-bold text-gray-700">
                Haryana, Gurugram, 122002
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
  {Object.keys(vendorDetails).length > 0 && (
    <>
      <div>
        <div>
          <label className="block text-sm font-bold text-gray-700">
            Contact Name :
          </label>
          <p>{vendorDetails.Name1}</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">
          Contact No:
          </label>
          <p>{vendorDetails.TelnrCall}</p>
        </div>
      </div>

      <div>
        <div>
          <label className="block text-sm font-bold text-gray-700">
          State:
          </label>
          <p>{vendorDetails.Stras}</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">
          State Code:
          </label>
          <p>{vendorDetails.Adrnr}</p>
        </div>
      </div>
    </>
  )}
</div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-bold text-gray-700 text-sm">
                Invoice Number:{" "}
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 text-sm">
                PO Number:{" "}
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={selectedPO}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Invoice Date: 
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Supply Month:
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={supplyMonth}
                onChange={(e) => setSupplyMonth(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">
                IRN NO:
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={irnNo}
                onChange={(e) => setIrnNo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                ACK No:
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={ackNo}
                onChange={(e) => setAckNo(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Select</th>
                <th className="border px-4 py-2 text-left">Item Code</th>
                <th className="border px-4 py-2 text-left">Material Code</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-right">
                  Ordered Quantity
                </th>
                <th className="border px-4 py-2 text-right">
                  Delivered Quantity
                </th>
                <th className="border px-4 py-2 text-right">Rate</th>
                <th className="border px-4 py-2 text-right">Subtotal</th>
                <th className="border px-4 py-2 text-right">GST (%)</th>
                <th className="border px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {formItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!selectedItems[item.Ebelp]}
                      onChange={() => handleCheckboxChange(item.Ebelp)}
                    />
                  </td>
                  <td className="border px-4 py-2">{item.Ebelp || ""}</td>
                  <td className="border px-4 py-2">{item.Matnr || ""}</td>
                  <td className="border px-4 py-2">{item.Txz01 || ""}</td>
                  <td className="border px-4 py-2 text-right">
                    {item.Menge || ""}
                  </td>
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
                      min={0}
                    />
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {item.Netpr || ""}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {(
                      parseFloat(item.Netpr || 0) *
                      parseFloat(deliveredQuantities[item.Ebelp] || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {(
                      parseInt(item.CGST || 0) +
                      parseInt(item.SGST || 0) +
                      parseInt(item.IGST || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {(
                      parseFloat(item.Netpr || 0) *
                      parseFloat(deliveredQuantities[item.Ebelp] || 0) *
                      (1 +
                        (parseFloat(item.CGST || 0) +
                          parseFloat(item.SGST || 0) +
                          parseFloat(item.IGST || 0)) /
                          100)
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
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="font-bold">GST Tax:</span>
                <span>{(total - subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-bold text-lg">
                <span>Total:</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoicePage;
 