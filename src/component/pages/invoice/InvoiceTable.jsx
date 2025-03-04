import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../../template/Sidebar.jsx";

const InvoicesTable = ({ user }) => {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [selectedApprovers, setSelectedApprovers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;

  useEffect(() => {
    if (!id) {
      setError("Vendor ID is missing!");
      setLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:4000/api/invoices", {
          params: { vendor_id: id, page, limit, status: statusFilter },
        });
        setInvoices(response.data || []);
      } catch (error) {
        setError("Failed to fetch invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchApprovers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/approvers");
        console.log("Approvers Data:", response.data); // Log the response data
        setApprovers(response.data || []);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchInvoices();
    fetchApprovers();
  }, [id, page, statusFilter]);

  const handleAssignApprover = async (invoiceId) => {
    if (!selectedApprovers[invoiceId]) {
      alert("Please select an approver first.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/assign-approver", {
        invoice_id: invoiceId,
        approver_id: selectedApprovers[invoiceId],
      });
      alert("Approver assigned successfully!");
    } catch (error) {
      console.error("Error assigning approver:", error);
      alert("Failed to assign approver. Try again.");
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:4000/api/invoices/${invoiceId}`);
      // Remove the deleted invoice from the state
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
      alert("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice. Try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar user={{ role: "vendor" }} />
      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl text-center font-bold text-blue-600 mb-6">Invoices History</h2>

          <div className="flex justify-between items-center mb-6">
            <label className="font-medium ">Filter by Status:</label>
            <select
              className="border px-4 py-2 rounded-md focus:ring focus:ring-blue-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center text-blue-500 text-lg">Loading invoices...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-3">Select</th>
                    <th className="px-4 py-3">Invoice Number</th>
                    <th className="px-4 py-3">PO ID</th>
                    <th className="px-4 py-3">EI ID</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b  text-center hover:bg-gray-100">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                      <td className="px-4 py-3">{invoice.invoice_number}</td>
                      <td className="px-4 py-3">{invoice.po_id}</td>
                      <td className="px-4 py-3">{invoice.ei_ID}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">
                        {parseFloat(invoice.total || 0).toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          invoice.status === "Approved"
                            ? "text-green-600"
                            : invoice.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {invoice.status}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No invoices found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;