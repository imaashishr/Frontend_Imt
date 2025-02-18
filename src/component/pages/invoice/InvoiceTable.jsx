import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../../template/Sidebar.jsx";

const InvoicesTable = ({ user }) => {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;

  const user1 = { role: "vendor" };
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
        console.log(`Fetching invoices for Vendor ID: ${id}, Page: ${page}, Status: ${statusFilter}`);
        const response = await axios.get("http://localhost:4000/api/invoices", {
          params: { vendor_id: id, page, limit, status: statusFilter },
        });

        if (Array.isArray(response.data)) {
          setInvoices(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Invalid response from server.");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error.response?.data || error.message);
        setError("Failed to fetch invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [id, page, statusFilter]);

  return (
    <div className="flex ">
      <Sidebar user={user1} />

      <div className="flex-1  pl-20 pr-10 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl text-center font-bold text-blue-600 mb-6">Invoices History</h2>

          {/* Status Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <label className="font-medium mb-2 md:mb-0">Filter by Status:</label>
            <select
              className="border px-4 py-2 rounded-md focus:ring focus:ring-blue-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center text-blue-500 text-lg">Loading invoices...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Invoice Number</th>
                    <th className="px-4 py-3 text-left">PO ID</th>
                    <th className="px-4 py-3 text-left">EI ID</th>
                    <th className="px-4 py-3 text-left">Total Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-3">{invoice.invoice_number}</td>
                      <td className="px-4 py-3">{invoice.po_id}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{invoice.eiId}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">
                        ${parseFloat(invoice.total || 0).toFixed(2)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No invoices found.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">Page {page}</span>
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              disabled={invoices.length < limit}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;
