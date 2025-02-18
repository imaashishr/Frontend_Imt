import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../template/Sidebar";
import "../../custom css/PoCard.css";

const PoPage = ({ user }) => {
  const [poData, setPoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user1 = JSON.parse(localStorage.getItem("user")); 
  const token = user1.token;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user info is >>>>",user1);
    const lifnr = user1?.lifnr; 
    console.log("Vendor LIFNR:", lifnr);

    const fetchPoData = async () => {
      if (!lifnr) {
        setError("Vendor ID (LIFNR) is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/api/po/getPoByLifnr/${lifnr}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response?.data) {
          setPoData(response.data[0]); // Assuming 'd.results' is where the data resides
          console.log("PO Data:", poData);
        } else {
          setPoData([]); // Handle case where no data is returned
        }
        console.log("res",response.data[0])
      } catch (error) { 
        console.error("Error fetching PO data:", error.response || error.message);
        setError("Error fetching PO data");
      } finally {
        setLoading(false);
      }
    };

    fetchPoData();
  }, []);

  const handleCardClick = (po) => {
    navigate("/po-items", { state: { po } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-blue-600">
        Loading Purchase Orders...
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
      <Sidebar user={user} />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-center text-[#3B71CA] mb-8">
            Purchase Orders
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {poData.map((po, index) => (
              <div
                key={index}
                className="group bg-white shadow-xl rounded-lg p-6 cursor-pointer transform transition-transform hover:scale-105 relative"
                onClick={() => handleCardClick(po)}
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-3">{po.Ebeln}</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Vendor Code</strong> {po.Lifnr}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Status: Pending</strong> {po.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoPage;
