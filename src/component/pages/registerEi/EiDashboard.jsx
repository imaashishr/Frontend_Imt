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
  const [selectedApprovers, setSelectedApprovers] = useState({});
  const [approvers, setApprovers] = useState([]);
  const [assignedApprovers, setAssignedApprovers] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [invoiceHeader, setInvoiceHeader] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemForApproval, setSelectedItemForApproval] = useState(null);

  useEffect(() => {
    fetchPendingInvoices();
    fetchAllInvoices();
    fetchApprovers();
  }, []);

  // Fetch pending invoices
  const fetchPendingInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/ei/pending-invoices",
        {
          params: { ei_ID: user?.id }, // Ensure user.id exists
        }
      );

      console.log("Fetched pending invoices:", response.data);

      setPendingInvoices(response.data);
      fetchAssignedApprovers(response.data);
    } catch (error) {
      console.error("Error fetching pending invoices:", error);
      toast.error("Failed to load pending invoices.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all invoices
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

  // Fetch approvers
  const fetchApprovers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/approvers");
      if (response.data.success && Array.isArray(response.data.approvers)) {
        console.log("Approvers response:", response.data);
        setApprovers(response.data.approvers);
      } else {
        console.error("Expected an array but got:", response.data);
        setApprovers([]);
      }
    } catch (error) {
      console.error("Error fetching approvers:", error);
      toast.error("Failed to load approvers.");
    }
  };

  // Fetch assigned approvers for each invoice
  const fetchAssignedApprovers = async (pendingInvoices) => {
    try {
      const assignedApproversData = {};
      const requests = pendingInvoices.map(async (invoice) => {
        const response = await axios.get(
          `http://localhost:4000/api/approvers/assigned/${invoice.invoice_number}`
        );
        assignedApproversData[invoice.invoice_number] =
          response.data.assignedApprovers;
        console.log("Assigned Approvers:", response.data.assignedApprovers);
      });

      await Promise.all(requests);
      setAssignedApprovers(assignedApproversData);
    } catch (error) {
      console.error("Error fetching assigned approvers:", error);
    }
  };

  const handleApproverChange = (invoiceNumber, approverId) => {
    setSelectedApprovers((prev) => ({
      ...prev,
      [invoiceNumber]: approverId,
    }));
  };

  // Handle assigning an approver to an invoice
  const handleAssignApprover = async (invoiceNumber, approverId) => {
    if (!approverId) {
      toast.error("Please select an approver first.");
      return;
    }

    try {
      const payload = {
        invoice_id: invoiceNumber,
        approver_ids: [approverId],
      };

      const response = await axios.post(
        "http://localhost:4000/api/approvers/assign",
        payload
      );

      toast.success("Approver assigned successfully!");

      // Refresh the list of invoices and assigned approvers
      fetchPendingInvoices();
      setSelectedApprover(null); // Clear the selected approver
    } catch (error) {
      console.error("Error assigning approver:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      toast.error("Failed to assign approver. Try again.");
    }
  };

  // Handle deleting an approver from an invoice
  const handleDeleteApprover = async (invoiceId, approverId) => {
    if (!approverId) {
      toast.error("No approver selected.");
      return;
    }

    try {
      const payload = {
        invoice_id: invoiceId,
        approver_id: approverId,
      };

      const response = await axios.delete(
        "http://localhost:4000/api/approvers/unassign",
        {
          data: payload,
        }
      );

      toast.success("Approver removed successfully!");

      // Refresh the list of assigned approvers
      setAssignedApprovers((prev) => {
        const updatedApprovers = { ...prev };
        updatedApprovers[invoiceId] = updatedApprovers[invoiceId].filter(
          (id) => id !== approverId
        );
        return updatedApprovers;
      });
    } catch (error) {
      console.error("Error removing approver:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      toast.error("Failed to remove approver. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Handle selecting an invoice
  const handleSelectInvoice = async (invoiceNumber) => {
    setSelectedInvoice(invoiceNumber);

    try {
      // Fetch header data
      const headerResponse = await axios.get(
        "http://localhost:4000/api/invoice-header",
        {
          params: { invoice_number: invoiceNumber },
        }
      );
      setInvoiceHeader(headerResponse.data);

      // Fetch items data
      const itemsResponse = await axios.get(
        "http://localhost:4000/api/invoice-items",
        {
          params: { invoice_number: invoiceNumber },
        }
      );
      setInvoiceItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      toast.error("Failed to load invoice data.");
    }
  };

  return (
    <div className="flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col ml-40 mr-30 p-6 bg-gray-100 min-h-screen">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
        >
          Logout
        </button>

        <h1 className="text-3xl font-bold text-center text-[#3B71CA] mb-6">
          Vendor Invoice Approver
        </h1>

        <div className="flex">
          <div className="w-2/3 pr-6">
            <div className="bg-white shadow-lg mb-6 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">
                Welcome, {user?.name}
              </h2>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Department:</strong> {user?.role}
              </p>
              <p>
                <strong>SAP ID:</strong> {user?.id}
              </p>
            </div>

            <div className="bg-white shadow-lg p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-3">Header :</h2>
              {loading ? (
                <p>Loading pending invoices...</p>
              ) : pendingInvoices.length === 0 ? (
                <p>No pending approvals.</p>
              ) : (
                <div>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">
                          Invoice #
                        </th>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">
                          PO Number
                        </th>
                        <th className="border border-gray-300 p-2">
                          Vendor ID
                        </th>
                        <th className="border border-gray-300 p-2">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingInvoices.map((invoice) => (
                        <tr
                          key={invoice.invoice_number}
                          className="text-center"
                        >
                          <td className="border border-gray-300 p-2">
                            {invoice.invoice_number}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {new Date(
                              invoice.invoice_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {invoice.items[0].Ebeln}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {invoice.vendor_id}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {invoice.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h2 className="text-xl font-semibold mb-3">Items :</h2>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">
                          Select
                        </th>
                        <th className="border border-gray-300 p-2">
                          Serial No.
                        </th>
                        <th className="border border-gray-300 p-2">
                          PO Number
                        </th>
                        <th className="border border-gray-300 p-2">
                          Item Code
                        </th>
                        <th className="border border-gray-300 p-2">
                          Material Number
                        </th>
                        <th className="border border-gray-300 p-2">
                          Description
                        </th>
                        <th className="border border-gray-300 p-2">Quantity</th>
                        <th className="border border-gray-300 p-2">Rate</th>
                        <th className="border border-gray-300 p-2 ">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingInvoices.map((invoice, invoiceIndex) =>
                        invoice.items.map((item, itemIndex) => (
                          <tr
                            key={`${invoiceIndex}-${itemIndex}`}
                            className="text-center"
                          >
                            <td className="border border-gray-300 p-2">
                              {/* Checkbox onChange Handler */}
                              <input
                                type="checkbox"
                                checked={selectedItems.some(
                                  (selected) =>
                                    selected.invoiceNumber ===
                                      invoice.invoice_number &&
                                    selected.itemId === item.id
                                )}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    // Update selectedItems
                                    setSelectedItems((prev) => [
                                      ...prev,
                                      {
                                        invoiceNumber: invoice.invoice_number,
                                        itemId: item.id,
                                      },
                                    ]);

                                    // Update selectedItemForApproval
                                    setSelectedItemForApproval({
                                      invoiceNumber: invoice.invoice_number,
                                      itemId: item.id,
                                    });

                                    // Update selectedInvoice
                                    setSelectedInvoice(invoice.invoice_number);
                                  } else {
                                    // Remove the item from selectedItems
                                    setSelectedItems((prev) =>
                                      prev.filter(
                                        (selected) =>
                                          !(
                                            selected.invoiceNumber ===
                                              invoice.invoice_number &&
                                            selected.itemId === item.id
                                          )
                                      )
                                    );

                                    // Clear selectedItemForApproval if the current item is deselected
                                    if (
                                      selectedItemForApproval?.invoiceNumber ===
                                        invoice.invoice_number &&
                                      selectedItemForApproval?.itemId ===
                                        item.id
                                    ) {
                                      setSelectedItemForApproval(null);
                                    }

                                    // Clear selectedInvoice if no items are selected for this invoice
                                    if (
                                      !selectedItems.some(
                                        (selected) =>
                                          selected.invoiceNumber ===
                                          invoice.invoice_number
                                      )
                                    ) {
                                      setSelectedInvoice(null);
                                    }
                                  }
                                }}
                              />
                            </td>
                            <td className="border border-gray-300 p-2">
                              {itemIndex + 1}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.Ebeln}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.Ebelp}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.Matnr}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.Meins}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.deliveredQty}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.Netpr}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.Netpr * item.deliveredQty}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                        <td className="border border-gray-300 p-2">
                          {invoice.invoice_number}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {invoice.vendor_id}
                        </td>
                        <td className="border border-gray-300 p-2">
                          ${invoice.total}
                        </td>
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

          {/* Approver Div */}
          <div className="flex flex-row md:flex-col gap-6">
            {/* Assign Approver Section */}
            <div className="w-full md:w-full pl-6">
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Assign Approver</h2>
                {selectedInvoice ? (
                  <>
                    <p className="mb-3">
                      <strong>Selected Invoice:</strong> {selectedInvoice}
                    </p>
                    <select
                      onChange={(e) => {
                        const approverId = e.target.value;
                        handleApproverChange(selectedInvoice, approverId);
                        if (approverId) {
                          handleAssignApprover(selectedInvoice, approverId);
                        }
                      }}
                      className="w-full p-2 rounded border border-gray-300 mb-3"
                    >
                      <option value="">Select an Approver</option>
                      {approvers
                        .filter(
                          (approver) =>
                            !assignedApprovers[selectedInvoice]?.includes(
                              approver.id
                            ) // Exclude already assigned approvers
                        )
                        .map((approver) => (
                          <option key={approver.id} value={approver.id}>
                            {approver.name}
                          </option>
                        ))}
                    </select>
                  </>
                ) : (
                  <p>Please select an invoice to assign an approver.</p>
                )}
              </div>
            </div>

            {/* Assigned Approvers Section */}
            <div className="w-full md:w-full pl-6">
              <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">
                  Assigned Approvers For: {selectedInvoice}
                </h2>
                {!assignedApprovers[selectedInvoice] ||
                assignedApprovers[selectedInvoice].length === 0 ? (
                  <p>No assigned approvers found.</p>
                ) : (
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">
                          Approver ID
                        </th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedApprovers[selectedInvoice]?.map((approverId) => {
                        const approver = approvers.find(
                          (a) => a.id === approverId
                        );
                        return (
                          <tr key={approverId} className="text-center">
                            <td className="border border-gray-300 p-2">
                              {approver ? (
                                approver.name
                              ) : (
                                <span>No Name Found</span>
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                                Pending
                              </span>
                            </td>
                            <td className="border border-gray-300 p-2">
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() =>
                                  handleDeleteApprover(
                                    selectedInvoice,
                                    approverId
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EiDashboard;
