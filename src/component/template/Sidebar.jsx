import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faShoppingCart, faClockRotateLeft, faTruck, faFileInvoice, faEye } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ user }) => {
  console.log("User in Sidebar:", user);
  console.log("User Role:", user?.role);
  console.log("User ID:", user?.id);

  const [isExpanded, setIsExpanded] = useState(false);

  // Sidebar items, filter them based on the user's role
  const items = [
    { label: "Home", path: "/home", icon: faHome, roles: ["vendor", "admin", "approver"] },
    { label: "OCR", path: "/ocr", icon: faEye, roles: ["vendor"] },
    { label: "GRN", path: "/grn", icon: faTruck, roles: ["vendor"] },
    { label: "Register User", path: "/register-ei", icon: faPlus, roles: ["admin"] },
    { label: "PO", path: "/vendor-po", icon: faShoppingCart, roles: ["vendor"] },
    { label: "ASN", path: "/asn", icon: faTruck, roles: ["vendor"] },
    { label: "Invoice", path: "/invoice", icon: faFileInvoice, roles: ["vendor"] },
    { label: "EIC Dashboard", path: `/invoices/${user?.id}`, icon: faHome, roles: ["Ei"] },
    { label: "Invoice History", path: `/invoices/${user?.id}`, icon: faClockRotateLeft, roles: ["vendor"] },
   
    { label: "Vendor Invoices", path: "/vendor-invoices", icon: faEye, roles: ["Ei"] },
    


    { label: "Invoices", path: `/approverinvoice`, icon: faFileInvoice, roles: ["approver"] },
   
  ];

  // Filter the sidebar items based on the user's role
  const filteredItems = user ? items.filter(item => item.roles.includes(user.role)) : [];

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 bg-[#3B71CA] pt-5 rounded-r-lg shadow-lg z-50 
      ${isExpanded ? 'w-[220px]' : 'w-[60px]'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className="list-none p-0 h-[100vh] overflow-y-auto scrollbar-hide">
        {filteredItems.map((item, index) => (
          <li key={index} className="relative">
            <Link to={item.path} className="flex items-center p-5 hover:bg-[#00bcd1] transition-colors text-white w-full">
              <FontAwesomeIcon icon={item.icon} className="text-2xl mr-2" />
              <span className={`absolute left-[80px] top-1/2 transform -translate-y-1/2 transition-opacity duration-300 
              ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
