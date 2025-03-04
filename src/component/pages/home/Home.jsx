import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../template/Sidebar.jsx";
import { useNavigate } from "react-router-dom";

const Home = ({ user, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user1 = JSON.parse(localStorage.getItem("user"));
  const token = user1?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/vendors/vendor-id", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        setError("Error fetching vendor details");
      } finally {
        setLoading(false);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/vendors/vendors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        setError("Error fetching vendor list");
      } finally {
        setLoading(false);
      }
    };

    const fetchEIInfo = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/ei/ei-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        setError("Error fetching EI details");
      } finally {
        setLoading(false);
      }
    };

    const fetchApprovers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/approvers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        setError("Error fetching approver details");
      } finally {
        setLoading(false);
      }
    };

    if (!user1) {
      setError("Unauthorized access");
      setLoading(false);
      return;
    }

    switch (user1.role) {
      case "vendor":
        fetchVendorDetails();
        break;
      case "admin":
        fetchVendors();
        break;
      case "Ei":
        fetchEIInfo();
        break;
      case "approver":
        fetchApprovers();
        break;
      default:
        setError("Invalid role detected");
        setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-blue-600">Loading details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-gray-500">No data found.</div>;
  }

  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen relative">
        <div className="flex justify-end">
          <button
            className="bg-[#3B71CA] text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-[#3B71CA] mb-5">
          {user1.role === "vendor"
            ? "Vendor Details"
            : user1.role === "admin"
            ? "Vendors List"
            : user1.role === "Ei"
            ? "EI Information"
            : "Approver Details"}
        </h1>

        {user1.role === "vendor" && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold text-black-600 mb-4">
              Vendor Id: {user.lifnr}
            </h2>
            <h2 className="text-3xl font-semibold text-blue-600 mb-4">
              Vendor Name: {user.name}
            </h2>
          </div>
        )}

        {user1.role === "admin" && Array.isArray(data) && data.length > 0 ? (
          <div className="space-y-8 flex flex-col items-center">
            {data.map((vendor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden p-8 w-full max-w-5xl">
                <h2 className="text-3xl font-semibold text-black-600 mb-4">
                  <strong>Vendor id:</strong> {vendor.Lifnr}
                </h2>
                <h2 className="text-3xl font-semibold text-blue-600 mb-4">
                  <strong>Vendor Name:</strong> {vendor.Name1}
                </h2>
              </div>
            ))}
          </div>
        ) : user1.role === "admin" ? (
          <div className="text-center text-xl text-gray-500">No vendors found</div>
        ) : null}

        {user1.role === "Ei" && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold text-blue-600 mb-4">EIC Name: {user.name}</h2>
            <p className="font-medium text-gray-700"><strong>EIC id:</strong> {user.id}</p>
            <p className="font-medium text-gray-700"><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        {user1.role === "approver" && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold text-blue-600 mb-4">Approver Name: {user1.name}</h2>
            <p className="font-medium text-gray-700"><strong>Approver id:</strong> {user1.id}</p>
            <p className="font-medium text-gray-700"><strong>Role:</strong> {user1.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
