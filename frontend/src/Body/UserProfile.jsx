import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import LoginPage from "./LoginPage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_api } from "../../config/config.json";

function UserProfile() {
  const navigate = useNavigate();
  const { isLogedIn, userId, token, logOut } = useContext(LoginContext);
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [updateError, setUpdateError] = useState({});
  const [serverResponse, setServerResponse] = useState(""); // Server response message

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backend_api}/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response?.data?.userinfo);
    } catch (error) {
      if (error?.response?.status === 401) {
        logOut();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUserData();
  }, [userId]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!userData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!userData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!userData?.phone?.trim()) {
      errors.phone = "Phone is required.";
    } else if (!/^\d{10}$/.test(userData.phone)) {
      errors.phone = "Phone must be 10 digits.";
    }
    setUpdateError(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!validateForm()) return; // If form is invalid, stop submission

    try {
      const response = await axios.put(`${backend_api}/user/${userId}/update`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setServerResponse(response?.data?.message || "Profile updated successfully!");
    } catch (error) {
      setServerResponse(error?.response?.data?.message || "Error updating profile.");
    }
  };

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    // Submit the new password to the backend here
    // console.log("Password changed:", password);
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Profile Deletion
  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(`${backend_api}/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      logOut();
      navigate("/");
    } catch (error) {
      // console.log("Error deleting profile:", error);
    } finally {
      setIsDeleteModalOpen(false); // Close modal
    }
  };

  return !isLogedIn ? (
    <LoginPage />
  ) : (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center p-6 md:p-10">
      <div className="bg-white shadow-lg rounded-3xl p-8 md:p-10 mb-10 w-full max-w-4xl">
        {/* Profile Information */}
        <h2 className="text-4xl font-bold text-center text-green-600 mb-6">User Profile</h2>
        {loading ? (
          <div className="text-lg text-gray-700 text-center">Loading user data...</div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="w-full md:w-auto">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={userData?.name || ""}
                  onChange={handleInputChange}
                  className="w-full md:w-96 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {updateError.name && <p className="text-red-500 text-sm">{updateError.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={userData?.email || ""}
                  onChange={handleInputChange}
                  className="w-full md:w-96 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {updateError.email && <p className="text-red-500 text-sm">{updateError.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={userData?.phone || ""}
                  onChange={handleInputChange}
                  className="w-full md:w-96 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {updateError.phone && <p className="text-red-500 text-sm">{updateError.phone}</p>}
              </div>
              <div className="flex space-x-4 mt-4">
                {/* <button
                  className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-500 transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  Change Password
                </button> */}
                {/* <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-500 transition"
                  onClick={handleProfileUpdate}
                >
                  Update Profile
                </button> */}
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-500 transition"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete Profile
                </button>
              </div>
              {serverResponse && <p className="text-green-600 text-sm mt-4">{serverResponse}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Password Change */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-4">Change Password</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-500 transition"
                onClick={handlePasswordChange}
              >
                Save
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-500 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-4">Delete Profile</h3>
            <p className="text-center text-gray-700 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-500 transition"
                onClick={handleDeleteProfile}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-500 transition"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
