import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Sidebar from "../../template/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const ApproverPage = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const fetchInvoices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get(
        `${API_URL}/api/approvers/invoiceapprovers/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvoices(Array.isArray(response.data.data) ? response.data.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to load invoices.");
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleApproval = async (id, status) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/approvers/approve_invoice`,
        { id, status: status.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.tracking_id === id ? { ...invoice, status } : invoice
        )
      );
      toast.success(`Invoice ${id} has been ${status.charAt(0).toUpperCase() + status.slice(1)}!`);

    } catch (error) {
      console.error("Error updating invoice status:", error);
      // setError("Failed to update invoice status. Try again.");
      toast.error(error.response?.data?.message || "Failed to update invoice status. Try again.");

    } finally {
      setUpdating(false);
    }
  };

  const handleCheckboxChange = (tracking_id) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(Number(tracking_id))
        ? prevSelected.filter((id) => id !== Number(tracking_id))
        : [...prevSelected, Number(tracking_id)]
    );
    
  };

  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl text-center text-blue-500 font-bold mb-4">Invoices For Approval</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          {loading ? (
            <p className="text-center text-blue-500">Loading invoices...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : invoices.length === 0 ? (
            <p className="text-gray-500 text-center">No invoices found.</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Select Invoice</th>
                  <th className="px-4 py-2">Tracking ID</th>
                  <th className="px-4 py-2">Purchase Order</th>
                  <th className="px-4 py-2">Invoice Number</th>
                  <th className="px-4 py-2">Assign Date</th>
                  <th className="px-4 py-2">Assign Time</th>
                  <th className="px-4 py-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.tracking_id} className="border-t">
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.tracking_id)}
                        onChange={() => handleCheckboxChange(invoice.tracking_id)}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">{invoice.tracking_id}</td>
                    <td className="px-4 py-2 text-center">{invoice.purchase_order}</td>
                    <td className="px-4 py-2 text-center">{invoice.invoice_number}</td>
                    <td className="px-4 py-2 text-center">
                      {new Date(invoice.assigned_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">{invoice.assigned_time}</td>
                    <td className="px-4  py-2 text-center">
                      <button
                        onClick={() => handleApproval(invoice.tracking_id, "approved")}
                        disabled={updating}
                        className="bg-green-500 text-white px-3 py-1 rounded  hover:bg-green-600"
                      >
                        Approve
                      </button>

                    </td>
                    <td className="px-4 m-5 py-2 text-center">
                      <button
                        onClick={() => handleApproval(invoice.tracking_id, "rejected")}
                        disabled={updating}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
       <ToastContainer autoClose={3000}/>
    </div>
  );
};

ApproverPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
};

export default ApproverPage;