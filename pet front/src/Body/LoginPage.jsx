import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../context/LoginContext";
import logo from "../../public/logo.png";
import { backend_api } from "../../config/config.json";

const LoginPage = () => {
  const { setUserId, setToken, setIsLogedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [serverResponse, setServerResponse] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" }); // Clear error when the user starts typing
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (data.password.trim() === "") {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }

      const response = await axios.post(`${backend_api}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setServerResponse(response?.data?.message);
      window.sessionStorage.setItem("token", response?.data?.token);
      window.sessionStorage.setItem("userId", response?.data?.userId);
      setIsLogedIn(true);
      setUserId(response?.data?.userId);
      setToken(response?.data?.token);
      navigate("/");
    } catch (error) {
      if (error?.status == 400) setServerResponse("Email or Password is wrong");
    }
  };

  return (
    <div className="bg-[#d4e9e4] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#94a7a9] rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={logo}
            loading="lazy"
            alt="Sevet Nro"
            className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16"
          />
          <h2 className="text-white text-xl sm:text-2xl font-bold">Login to Your Account</h2>
        </div>

        {/* Login Form */}
        <form>
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3dd6c1] transition-all"
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
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3dd6c1] transition-all"
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>

          {/* Server Response */}
          {serverResponse && (
            <p className=" text-red-500 text-lg text-center mb-2 font-bold">{serverResponse}</p>
          )}

          <button
            type="submit"
            onClick={loginUser}
            className="w-full bg-[#3dd6c1] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#34bfa8] transition-all"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <div className="text-center mt-6 text-white text-sm sm:text-base">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="font-bold hover:underline">
              Register
            </Link>
          </p>
          {/* <p className="mt-4">
            <Link to="#" className="hover:underline">
              Forgot Password?
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
