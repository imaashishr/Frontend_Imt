import React, { useState, useCallback } from "react";
import { Form, Formik } from "formik";
import backgroundImage from "../../../assets/images/vendor.jpg";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input";
import Button from "../../ui/Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility

  const handleLogin = useCallback(async (values) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log("data---------", data);

      if (data.message === "Login successful") {
        localStorage.setItem("token", data.token);
        onLogin({
          id: data.user.id,
          email: values.email,
          role: data.user.role,
          token: data.token,
          name: data.user.name,
          lifnr: data.user.lifnr || '',
        });
        navigate("/home");
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  }, [onLogin, navigate]);

  const initialValues = { email: "", password: "" };

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    await handleLogin(values);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-auto h-auto">
      <div
        className="bg-cover bg-center h-screen w-[65%] bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#3B71CA] to-[#b2ebf2] p-6 md:p-10">
        <div className="w-full max-w-md bg-white text-gray-800 shadow-lg rounded-lg p-8 md:p-12 transition-transform transform hover:scale-95">
          <h1 className="text-center text-3xl font-bold text-[#036491] mb-6">
             Login Here...
          </h1>

          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
            {({ values, isSubmitting, errors, touched, setFieldValue }) => (
              <Form className="space-y-6">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  isError={errors.email && touched.email}
                  errorMessage={errors.email}
                />

                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"} // Toggle password visibility
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    isError={errors.password && touched.password}
                    errorMessage={errors.password}
                  />
                  {/* Eye icon to toggle password visibility */}
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((prev) => !prev)} // Toggle visibility
                    className="absolute right-3 top-3 text-xl"
                    aria-label={passwordVisible ? "Hide password" : "Show password"} // Add accessibility
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Conditional icon */}
                  </button>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <Button
                  type="submit"
                  color="blue"
                  isDisabled={isSubmitting}
                  className="w-full bg-[#036491] text-white py-2 rounded-md hover:bg-[#024b63] transition duration-300"
                >
                  {isSubmitting ? "Loading..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
