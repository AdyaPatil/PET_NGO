import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../public/logo.png";
import { backend_api } from "../../config/config.json";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [serverResponse, setServerResponse] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value)
    setData({ ...data, [name]: value });
    // Clear error when the user starts typing
    // console.log(data)
    setError({ ...error, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", phone: "", password: "" };

    if (data.name.trim() === "") {
      newErrors.name = "Full name is required.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
      isValid = false;
    }

    if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const formData = new FormData();

      // Append form data
      for (let key in data) {
        // console.log( key, data[key])
        formData.append(key, data[key]);
      }

      const response = await axios.post(`${backend_api}/user-register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setServerResponse("User created successfully!");
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerResponse("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error?.status == 400) setServerResponse(error?.response?.data?.detail);
      else setServerResponse("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#d4e9e4] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#94a7a9] rounded-3xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Sevet Nro" loading="lazy" className="mx-auto mb-4 h-10 w-10" />
          <h2 className="text-white text-2xl font-bold">Create Your Account</h2>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3dd6c1] transition duration-200 ease-in"
              required
            />
            {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3dd6c1] transition duration-200 ease-in"
              required
            />
            {error.phone && <p className="text-red-500 text-sm mt-1">{error.phone}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3dd6c1] transition duration-200 ease-in"
              required
            />
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3dd6c1] transition duration-200 ease-in"
              required
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>

          {/* Server Response Message */}
          {serverResponse && (
            <p className={`text-center ${showSuccess ? "text-green-600" : "text-red-600"} mb-4`}>
              {serverResponse}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#3dd6c1] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#34bfa8] transition-all"
          >
            Register
          </button>
        </form>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            Registration successful! Redirecting to login...
          </div>
        )}

        {/* Additional Links */}
        <div className="text-center mt-6 text-white">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
