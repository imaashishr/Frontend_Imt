import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./component/pages/loginPage/LoginPage";
import Home from "./component/pages/home/Home";
import ExistingVendor from "./component/pages/existing_vendor/ExistingVendor";
import AddVendor from "./component/pages/addVendor/AddVendor";
import VendorPo from "./component/pages/vendor_po/VendorPo";
import Invoice from "./component/pages/invoice/Invoice";
import AsnForm from "./component/pages/asn/AsnForm";
import AsnPage from "./component/pages/asn/AsnPage";
import PoItems from "./component/pages/vendor_po/PoItems";
import Ocr from "./component/pages/ocr/Ocr";
import RegisterEi from "./component/pages/registerEi/RegisterEi";
import InvoicesTable from "./component/pages/invoice/InvoiceTable";
import EiDashboard from "./component/pages/registerEi/EiDashboard"; // Import the EiDashboard

// Protected Route Component
const ProtectedRoute = ({ element, user, roles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false once user check is done
  }, []);

  const handleLogin = (loggedInUser) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking user
  }

  return (
    <Router>
      <div className="flex">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/home"
              element={
                user ? (
                  <Home user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/existing-vendor"
              element={
                <ProtectedRoute
                  element={<ExistingVendor user={user} />}
                  user={user}
                  roles={["admin"]}
                />
              }
            />
            <Route
              path="/vendor-po"
              element={
                <ProtectedRoute
                  element={<VendorPo user={user} />}
                  user={user}
                  roles={["vendor", "Ei"]}
                />
              }
            />
            <Route
              path="/invoice"
              element={
                <ProtectedRoute
                  element={<Invoice user={user} />}
                  user={user}
                  roles={["vendor"]}
                />
              }
            />
            <Route
              path="/asn-form"
              element={
                <ProtectedRoute
                  element={<AsnForm user={user} />}
                  user={user}
                  roles={["vendor"]}
                />
              }
            />
            <Route
              path="/asn"
              element={
                <ProtectedRoute
                  element={<AsnPage user={user} />}
                  user={user}
                  roles={["vendor"]}
                />
              }
            />
            <Route
              path="/po-items"
              element={
                <ProtectedRoute
                  element={<PoItems user={user} />}
                  user={user}
                  roles={["vendor", "Ei"]}
                />
              }
            />
            <Route
              path="/ocr"
              element={
                <ProtectedRoute
                  element={<Ocr user={user} />}
                  user={user}
                  roles={["vendor"]}
                />
              }
            />
            <Route
              path="/register-ei"
              element={
                <ProtectedRoute
                  element={<RegisterEi user={user} />}
                  user={user}
                  roles={["admin"]}
                />
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute
                  element={<InvoicesTable />}
                  user={user}
                  roles={["vendor"]}
                />
              }
            />
            {/* Add route for EiDashboard */}
            <Route
              path="/ei-dashboard"
              element={
                <ProtectedRoute
                  element={<EiDashboard user={user} />}
                  user={user}
                  roles={["Ei"]}
                />
              }
            />
            {/* Add a catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
