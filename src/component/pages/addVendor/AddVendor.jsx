import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input";
import Dropdown from "../../ui/dropdown/Dropdown";
import Button from "../../ui/Button/Button";
import {
  GetCountries,
  GetState,
  GetCity,
} from "react-country-state-city";
import Sidebar from "../../template/Sidebar";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AddVendorForm = ({ user}) => {
  console.log("User:", user.role);
  const navigate = useNavigate();
  
  const location = useLocation(); 
  const vendor = location.state?.vendor || {};
  const vendorId = vendor.vendorId;
  // console.log("Vendor ID:", vendorId);

  // console.log("Vendor:", vendor);
  // if (vendor !== null && vendor !== undefined) {
  //   console.log("Vendor exists");
  // } else {
  //   console.log("Vendor does not exist");
  // }


  const isVendorRegistered = vendor && Object.keys(vendor).length > 0;

  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [countryId, setCountryId] = useState(vendor.Country || 0);
   const [stateId, setStateId] = useState(vendor.Regio || "");

  useEffect(() => {
    GetCountries().then((result) => {
      console.log("country", result);

      const countryid = parseInt(countryId, 10);

      console.log("countryid", countryId);
      GetState(countryid).then((result) => {
        console.log("helllo states", result);
        setStateList(result);
      });

      if (stateId) {
        console.log("stateIdeee", stateId);

        const stateid = parseInt(stateId, 10);
        console.log("stateid", stateid);
        GetCity(countryid, stateid).then((result) => {
          console.log("Cities:", result);  
          setCityList(result);
        });
      }

      setCountriesList(result);
    });
  }, [countryId, stateId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      Lifnr: values.Lifnr || null,
      title: values.title,
      grouping: values.grouping,
      Name1: values.Name1,
      bpRole: values.bpRole,
      SmtpAddr: values.SmtpAddr,
      TelnrCall: values.TelnrCall,
      gstCategory: values.gstCategory,
      Stcd3: values.Stcd3,
      Zpan: values.Zpan,
      Pstlz: values.Pstlz,
      Adrnr: values.Adrnr,
      Ort01: values.Ort01,
      Regio: values.Regio,
      Country: values.Country,
      Banka: values.Banka,
      Bankn: values.Bankn,
      ifscCode: values.ifscCode,
    };

    // console.log("payload", payload);
    try {
      let response;
      if (isVendorRegistered) {
        
        response = await axios.put(`http://localhost:4000/api/vendors/update-vendor/${vendorId}`, payload);
        alert("Vendor updated successfully!");
      } else {
        console.log("payload", payload);
        response = await axios.post("http://localhost:4000/api/vendors/register-vendor", payload);
        alert("Vendor added successfully!");
      }
  
      resetForm();
      navigate("/existing-vendor");
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      alert("There was an error submitting the form. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div>
      <Sidebar user={user} />
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center text-[#3B71CA] mb-6">
            {isVendorRegistered ? "Edit Vendor" : "Vendor Registration"}
          </h1>

          <Formik
            initialValues={{
              Lifnr: vendor ? vendor.Lifnr : null, // Lifnr is null when creating a new vendor
              title: vendor ? vendor.title : "",
              grouping: vendor ? vendor.grouping : "",
              Name1: vendor ? vendor.Name1 : "",
              bpRole: vendor ? vendor.bpRole : "",
              SmtpAddr: vendor ? vendor.SmtpAddr : "",
              TelnrCall: vendor ? vendor.TelnrCall : "",
              gstCategory: vendor ? vendor.gstCategory : "",
              Stcd3: vendor ? vendor.Stcd3 : "",
              Zpan: vendor ? vendor.Zpan : "",
              Pstlz: vendor ? vendor.Pstlz : "",
              Adrnr: vendor ? vendor.Adrnr : "",
              Ort01: vendor ? vendor.Ort01 : "",
              Regio: vendor ? vendor.Regio : "",
              Country: vendor ? vendor.Country : "",
              Banka: vendor ? vendor.Banka : "",
              Bankn: vendor ? vendor.Bankn : "",
              ifscCode: vendor ? vendor.ifscCode : "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.title) errors.title = "Title is required";
              if (!values.grouping) errors.grouping = "Group is required";
              if (!values.Name1) errors.Name1 = "Vendor name is required";
              if (!values.bpRole) errors.bpRole = "BP Role is required";
              if (!values.SmtpAddr) errors.SmtpAddr = "Email is required";
              if (!values.TelnrCall) errors.TelnrCall = "Mobile number is required";
              if (!values.gstCategory) errors.gstCategory = "GST category is required";
              if (!values.Stcd3) errors.Stcd3 = "GSTIN/UIN is required";
              if (!values.Zpan) errors.Zpan = "PAN number is required";
              if (!values.Adrnr) errors.Adrnr = "Street/House No. is required";
              if (!values.Ort01) errors.Ort01 = "City is required";
              if (!values.Regio) errors.Regio = "State is required";
              if (!values.Country) errors.Country = "Country is required";
              if (!values.Banka) errors.Banka = "Bank Name is required";
              if (!values.Bankn) errors.Bankn = "Account Number is required";
              if (!values.ifscCode) errors.ifscCode = "IFSC Code is required";
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, errors, touched, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        id="Lifnr"
                        type="text"
                        name="Lifnr"
                        placeholder="Vendor Code"
                        value={values.Lifnr || ""}
                        onChange={(e) =>
                          // Keep Lifnr empty when creating a new vendor, don't allow filling it
                          !vendor && setFieldValue("Lifnr", null)
                        }
                        isError={errors.Lifnr && touched.Lifnr}
                        errorMessage={errors.Lifnr}
                        disabled={vendor || values.Lifnr} // Disable field for new vendor (if Lifnr is set or editing)
                      />
                    </div>

                    <div>
                      <Dropdown
                        id="title"
                        name="title"
                        placeholder="Select Title"
                        value={values.title}
                        onChange={(option) => setFieldValue("title", option)}
                        options={[
                          { label: "Mr", value: "Mr" },
                          { label: "Mrs", value: "Mrs" },
                          { label: "Company", value: "Company" },
                        ]}
                        isError={errors.title && touched.title}
                        errorMessage={errors.title}
                      />
                    </div>
                    <div>
                      <Dropdown
                        id="grouping"
                        name="grouping"
                        placeholder="Select Group"
                        value={values.grouping}
                        onChange={(option) => setFieldValue("grouping", option)}
                        options={[
                          { label: "Domastic Vendor", value: "Domastic Vendor" },
                          { label: "Import Vendor", value: "Import Vendor" },
                          { label: "Transporter", value: "Transporter" },
                          { label: "Service Vendor", value: "Service Vendor" },
                        ]}
                        isError={errors.grouping && touched.grouping}
                        errorMessage={errors.grouping}
                      />
                    </div>
                    <div>
                      <Input
                        id="Name1"
                        type="text"
                        name="Name1"
                        placeholder="Vendor Name"
                        value={values.Name1}
                        onChange={(e) =>
                          setFieldValue("Name1", e.target.value)
                        }
                        isError={errors.Name1 && touched.Name1}
                        errorMessage={errors.Name1}
                      />
                    </div>

                    <div>
                      <Dropdown
                        id="bpRole"
                        name="bpRole"
                        placeholder="Select BP Role"
                        value={values.bpRole}
                        onChange={(option) => setFieldValue("bpRole", option)}
                        options={[
                          { label: "Domastic Vendor", value: "Domastic Vendor" },
                          { label: "Import Vendor", value: "Import Vendor" },
                          { label: "Transporter", value: "Transporter" },
                          { label: "Service Vendor", value: "Service Vendor" },
                        ]}
                        isError={errors.bpRole && touched.bpRole}
                        errorMessage={errors.bpRole}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Primary Contact Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        id="SmtpAddr"
                        type="email"
                        name="SmtpAddr"
                        placeholder="Email"
                        value={values.SmtpAddr}
                        onChange={(e) => setFieldValue("SmtpAddr", e.target.value)}
                        isError={errors.SmtpAddr && touched.SmtpAddr}
                        errorMessage={errors.SmtpAddr}
                      />
                    </div>

                    <div>
                      <Input
                        id="TelnrCall"
                        type="text"
                        name="TelnrCall"
                        placeholder="Mobile Number"
                        value={values.TelnrCall}
                        onChange={(e) =>
                          setFieldValue("TelnrCall", e.target.value)
                        }
                        isError={errors.TelnrCall && touched.TelnrCall}
                        errorMessage={errors.TelnrCall}
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      id="gstCategory"
                      type="text"
                      name="gstCategory"
                      placeholder="GST Category"
                      value={values.gstCategory}
                      onChange={(e) =>
                        setFieldValue("gstCategory", e.target.value)
                      }
                      isError={errors.gstCategory && touched.gstCategory}
                      errorMessage={errors.gstCategory}
                    />
                  </div>

                  <div>
                    <Input
                      id="Stcd3"
                      type="text"
                      name="Stcd3"
                      placeholder="GSTIN/UIN"
                      value={values.Stcd3}
                      onChange={(e) =>
                        setFieldValue("Stcd3", e.target.value)
                      }
                      isError={errors.Stcd3 && touched.Stcd3}
                      errorMessage={errors.Stcd3}
                    />
                  </div>

                  <div>
                    <Input
                      id="Zpan"
                      type="text"
                      name="Zpan"
                      placeholder="PAN Number"
                      value={values.Zpan}
                      onChange={(e) =>
                        setFieldValue("Zpan", e.target.value)
                      }
                      isError={errors.Zpan && touched.Zpan}
                      errorMessage={errors.Zpan}
                    />
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Primary Address Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        id="Pstlz"
                        type="text"
                        name="Pstlz"
                        placeholder="Postal Code"
                        value={values.Pstlz}
                        onChange={(e) =>
                          setFieldValue("Pstlz", e.target.value)
                        }
                        isError={errors.Pstlz && touched.Pstlz}
                        errorMessage={errors.Pstlz}
                      />
                    </div>

                    <div>
                      <Input
                        id="Adrnr"
                        type="text"
                        name="Adrnr"
                        placeholder="Street / House No"
                        value={values.Adrnr}
                        onChange={(e) =>
                          setFieldValue("Adrnr", e.target.value)
                        }
                        isError={errors.Adrnr && touched.Adrnr}
                        errorMessage={errors.Adrnr}
                      />
                    </div>

                    <Dropdown
                      id="Country"
                      name="Country"
                      placeholder="Select Country"
                      value={values.Country}
                      onChange={(option) => {
                        setFieldValue("Country", option);
                        setCountryId(option);
                      }}
                      options={countriesList.map((Country) => ({
                        label: Country.name,
                        value: Country.id,
                      }))}
                      isError={errors.Country && touched.Country}
                      errorMessage={errors.Country}
                    />

                    <Dropdown
                      id="Regio"
                      name="Regio"
                      placeholder="Select State"
                      value={values.Regio}
                      onChange={(option) => {
                        setFieldValue("Regio", option);
                        setStateId(option);
                      }}
                      options={stateList.map((Regio) => ({
                        label: Regio.name,
                        value: Regio.id,
                      }))}
                      isError={errors.Regio && touched.Regio}
                      errorMessage={errors.Regio}
                    />

                    <Dropdown
                      id="Ort01"
                      name="Ort01"
                      placeholder="Select City"
                      value={values.Ort01}
                      onChange={(option) => setFieldValue("Ort01", option)}
                      options={cityList.map((Ort01) => ({
                        label: Ort01.name,
                        value: Ort01.id,
                      }))}
                      isError={errors.Ort01 && touched.Ort01}
                      errorMessage={errors.Ort01}
                    />
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Bank Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        id="Banka"
                        type="text"
                        name="Banka"
                        placeholder="Bank Name"
                        value={values.Banka}
                        onChange={(e) =>
                          setFieldValue("Banka", e.target.value)
                        }
                        isError={errors.Banka && touched.Banka}
                        errorMessage={errors.Banka}
                      />
                    </div>

                    <div>
                      <Input
                        id="Bankn"
                        type="text"
                        name="Bankn"
                        placeholder="Account Number"
                        value={values.Bankn}
                        onChange={(e) =>
                          setFieldValue("Bankn", e.target.value)
                        }
                        isError={errors.Bankn && touched.Bankn}
                        errorMessage={errors.Bankn}
                      />
                    </div>

                    <div>
                      <Input
                        id="ifscCode"
                        type="text"
                        name="ifscCode"
                        placeholder="IFSC Code"
                        value={values.ifscCode}
                        onChange={(e) =>
                          setFieldValue("ifscCode", e.target.value)
                        }
                        isError={errors.ifscCode && touched.ifscCode}
                        errorMessage={errors.ifscCode}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button type="submit" size="medium" isDisabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : isVendorRegistered ? "Update Vendor" : "Register Vendor"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddVendorForm;
