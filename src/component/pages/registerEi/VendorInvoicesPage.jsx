import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../template/Sidebar";
import VendorCard from "./VendorCard";

const VendorInvoicesPage = ({ user }) => {
  const [vendorId, setVendorId] = useState(null);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    if (user) {
      fetchVendorId(); // Fetch Vendor ID first
      fetchVendorInvoiceData(); // Then fetch invoices
    }
  }, [user]);

  /** ✅ Fetch Vendor ID for EI **/
  const fetchVendorId = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/vendors", {
        params: { eiId: user?.id }, // Fetch vendor linked to EI
      });

      if (response.data?.vendorId) {
        setVendorId(response.data.vendorId);
      } else {
        setVendorId("17300083");
      }
    } catch (error) {
      console.error("Error fetching vendor ID:", error);
      setVendorId("17300083");
    }
  };

  /** ✅ Fetch Invoices & Pending Invoices **/
  const fetchVendorInvoiceData = async () => {
    try {
      setLoading(true);

      // Fetch Total Invoices
      const totalResponse = await axios.get("http://localhost:4000/api/invoices", {
        params: { eiEmail: user?.SmtpAddr }, // EI's email to get invoices
      });

      const invoices = totalResponse.data || [];
      setTotalInvoices(invoices.length);

      // Fetch Pending Invoices
      const pendingResponse = await axios.get("http://localhost:4000/api/ei/pending-invoices", {
        params: { ei_ID: user?.id },
      });

      setPendingInvoices(pendingResponse.data.length);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      setError("Failed to load invoice data.");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Handle Click to Navigate **/
  const handleTileClick = () => {
    navigate("/ei-dashboard");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 ml-40 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-[#3B71CA] mb-6">Vendor Invoices</h1>

        {error && <div className="bg-red-100 p-4 text-red-700 mb-4">{error}</div>} {/* Show error message */}

        <div className="flex gap-6">
          {/* Vendor Invoice Card */}
          <VendorCard
            vendorId={vendorId} // Pass the Vendor ID
            totalInvoices={loading ? "Loading..." : totalInvoices}
            pendingInvoices={loading ? "Loading..." : pendingInvoices}
            onClick={handleTileClick} // Click to navigate
          />
        </div>
      </div>
    </div>
  );
};

export default VendorInvoicesPage;
