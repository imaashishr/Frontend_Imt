import React from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input";
import Button from "../../ui/Button/Button";
import axios from "axios";
import Sidebar from "../../template/Sidebar";
import Dropdown from "../../ui/dropdown/Dropdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterEi = ({ user }) => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      Name1: values.Name1,
      SmtpAddr: values.SmtpAddr,
      Dept: values.Dept,
      SapId: values.SapId,
      role: "Ei", // Fixed Role
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/ei/register-ei",
        payload
      );
      console.log("API Response:", response.data);

      resetForm();
      toast.success("EI registered successfully!", { autoClose: 3000 });

      // Navigate to another page after successful registration
      setTimeout(() => navigate("/ei-dashboard"), 3000);
    } catch (error) {
      console.error("Error registering EI:", error);
      toast.error("Failed to register EI. Please try again.");
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center text-[#3B71CA] mb-6">
            Register Users
          </h1>

          <Formik
            initialValues={{
              SapId: "",
              Name1: "",
              SmtpAddr: "",
              Dept: "",
              role: "Ei", // Fixed role
            }}
            validate={(values) => {
              const errors = {};
              if (!values.SapId) errors.SapId = "SAP ID is required";
              if (!values.Name1) errors.Name1 = "Name is required";
              if (!values.SmtpAddr) errors.SmtpAddr = "Email is required";
              if (!values.Dept) errors.Dept = "Department is required";
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="SapId"
                    name="SapId"
                    type="text"
                    placeholder="USER ID"
                    value={values.SapId}
                    onChange={(e) => setFieldValue("SapId", e.target.value)}
                    isError={errors.SapId && touched.SapId}
                    errorMessage={errors.SapId}
                  />

                  <Input
                    id="Name1"
                    name="Name1"
                    type="text"
                    placeholder="Name"
                    value={values.Name1}
                    onChange={(e) => setFieldValue("Name1", e.target.value)}
                    isError={errors.Name1 && touched.Name1}
                    errorMessage={errors.Name1}
                  />

                  <Input
                    id="SmtpAddr"
                    name="SmtpAddr"
                    type="email"
                    placeholder="Email"
                    value={values.SmtpAddr}
                    onChange={(e) => setFieldValue("SmtpAddr", e.target.value)}
                    isError={errors.SmtpAddr && touched.SmtpAddr}
                    errorMessage={errors.SmtpAddr}
                  />

                  <Dropdown
                    id="Dept"
                    name="Dept"
                    placeholder="Select Department"
                    value={values.Dept}
                    onChange={(selectedValue) => {
                      
                      setFieldValue("Dept", selectedValue);
                    }}
                    options={[
                      { label: "Vendor", value: "Vendor" },
                      { label: "ECI", value: "ECI" },
                      { label: "APPROVER", value: "APPROVER" },
                    ]}
                    isError={errors.Dept && touched.Dept}
                    errorMessage={errors.Dept}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#3B71CA] text-white px-6 py-2 rounded-md"
                  >
                    {isSubmitting ? "Submitting..." : "Register"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterEi;
