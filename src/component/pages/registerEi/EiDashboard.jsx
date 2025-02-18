import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../template/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EiDashboard = ({ user }) => {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  // List of approvers
  const approvers = ["ASHISH", "AMIT", "SAKSHIT", "SUMIT", "ABHISHEK"];

  useEffect(() => {
    fetchPendingInvoices();
    fetchAllInvoices(); // Fetch all invoices on component mount
  }, []);

  const fetchPendingInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/ei/pending-invoices", {
        params: { eiId: user?.id },
      });
      setPendingInvoices(response.data);
    } catch (error) {
      console.error("Error fetching pending invoices:", error);
      toast.error("Failed to load pending invoices.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/invoices", {
        params: { eiEmail: user?.SmtpAddr },
      });
      setAllInvoices(response.data);
    } catch (error) {
      console.error("Error fetching all invoices:", error);
      toast.error("Failed to load all invoices.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleAction = async (invoice_number, action, currentApproverIndex) => {
    try {
      // Send the approval/rejection action with the current approver info
      await axios.post(`http://localhost:4000/api/ei/approve-reject`, {
        invoice_number,
        action,
        eiId: user?.id, 
        currentApproverIndex,
      });

      toast.success(`Invoice ${action} successfully by ${approvers[currentApproverIndex]}!`);
      
      // Move to the next approver (or mark as final if last approver)
      if (currentApproverIndex < approvers.length - 1) {
        // Approve and move to the next approver
        fetchPendingInvoices();
      } else {
        // Final EI approval
        fetchPendingInvoices();
      }

      fetchAllInvoices(); // Refresh all invoices list
    } catch (error) {
      console.error(`Error updating invoice:`, error);
      toast.error(`Failed to ${action} invoice.`);
    }
  };

  // Define the handleLogout function here
  const handleLogout = () => {
    // Clear session or authentication token
    localStorage.removeItem("user");  // Adjust based on how you're storing the user session
    window.location.href = "/login";  // Redirect to login page after logout
  };

  return (
    <div className="flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col ml-40 mr-40 p-6 bg-gray-100 min-h-screen">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
        >
          Logout
        </button>

        <h1 className="text-3xl font-bold text-center text-[#3B71CA] mb-6">EI Dashboard</h1>

        <div className="bg-white shadow-lg mb-6 p-6 rounded-lg ">
          <h2 className="text-xl font-semibold mb-3">Welcome, {user?.name}</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Department:</strong> {user?.role}</p>
          <p><strong>SAP ID:</strong> {user?.id}</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Pending Invoice Approvals</h2>
          {loading ? (
            <p>Loading pending invoices...</p>
          ) : pendingInvoices.length === 0 ? (
            <p>No pending approvals.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Invoice #</th>
                  <th className="border border-gray-300 p-2">Vendor</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Approvers</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map((invoice) => (
                  <tr key={invoice.id} className="text-center">
                    <td className="border border-gray-300 p-2">{invoice.invoice_number}</td>
                    <td className="border border-gray-300 p-2">{invoice.vendor_id}</td>
                    <td className="border border-gray-300 p-2">${invoice.total}</td>
                    <td className="border border-gray-300 p-2">
                      {approvers.map((approver, index) => (
                        <div key={index}>
                          {invoice.status === "pending" && (
                            <button
                              onClick={() => handleAction(invoice.invoice_number, "approved", index)}
                              className="bg-green-500 text-white px-3 py-1 rounded-md"
                            >
                              Approve by {approver}
                            </button>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleAction(invoice.invoice_number, "rejected", approvers.length - 1)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
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

        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">All Invoices</h2>
          {invoiceLoading ? (
            <p>Loading all invoices...</p>
          ) : allInvoices.length === 0 ? (
            <p>No invoices found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Invoice #</th>
                  <th className="border border-gray-300 p-2">Vendor</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((invoice) => (
                  <tr key={invoice.id} className="text-center">
                    <td className="border border-gray-300 p-2">{invoice.invoice_number}</td>
                    <td className="border border-gray-300 p-2">{invoice.vendor_id}</td>
                    <td className="border border-gray-300 p-2">${invoice.total}</td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          invoice.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EiDashboard;
