import React, { useState, useEffect } from "react";
import axios from "axios";
import VendorCard from "./VendorCard";
import Sidebar from "../../template/Sidebar";
import Modal from "./Modal";
import SearchBar from "../../ui/search bar/SearchBar"; 

const ExistingVendors = ({user}) => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [mobileQuery, setMobileQuery] = useState(""); 


  const user1 = JSON.parse(localStorage.getItem("user")); 
  const token = user1.token
  // console.log(user1);
  const fetchVendors = async (search = "", mobile = "") => {
    

    try {
      const response = await axios.get("http://localhost:4000/api/vendors/vendors", {
        params: { search, mobile },  
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      setVendors(response.data); 
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
  // console.log(token)

  useEffect(() => {
    fetchVendors(); 
  }, []); 
 
  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchVendors(query, mobileQuery); 
  };

  const handleMobileChange = (event) => {
    const query = event.target.value;
    setMobileQuery(query);
    fetchVendors(searchQuery, query);  
  };

  const handleClickOutside = (event) => {
    if (event.target.id === "modal-container") {
      closeModal();
    }
    console.log("Clicked outside the modal", event.target.id);
    
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="flex">

      <Sidebar user={user} />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-[#3B71CA] mb-6 ml-20">
          Existing Vendors
        </h1>

        <SearchBar
          value={searchQuery}
          onSearch={handleSearchChange}  
          placeholder="Search by vendor name"
          className="ml-[200px] mb-5 px-5 pr-24 border-black"
        />

        <SearchBar
          value={mobileQuery}
          onSearch={handleMobileChange}  
          placeholder="Search by Mobile Number"
          className="ml-[80px] mb-5 px-5 pr-24 border-black"
        />

        <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 md:grid-cols-3 gap-6 ml-[200px]">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onClick={() => openModal(vendor)}
            />
          ))}
        </div>

        {isModalOpen && selectedVendor && (
          <div
            id="modal-container"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          >
            <Modal vendor={selectedVendor} onClose={closeModal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExistingVendors;
