import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { google_Maps_Api_Key } from "../../config/config.json";
import { backend_api } from "../../config/config.json";
import LoginPage from "./LoginPage";
import UserPetDetailsPageUI from "../ShimmerUI/UserPetDetailsPageUI";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 20.5937, // Default center (India)
  lng: 78.9629,
};

const PetDetails = () => {
  const navigate = useNavigate();
  const { isLogedIn, userId, token, logOut } = useContext(LoginContext);
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(center); // Marker position on map
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isPetDeletedModalOpen, setIsPetDeletedModalOpen] = useState(false);

  const handleMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    setPet((prevData) => ({
      ...prevData,
      location: { lat: newLat, lng: newLng },
    }));
    // console.log(newLat, newLng);
  };

  const getPetDetails = async () => {
    try {
      const response = await axios.get(`${backend_api}/user/${userId}/pet/${petId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      setPet(response?.data?.petinfo);
      setMarkerPosition(response?.data?.petinfo?.location);
    } catch (error) {
      if (error?.response?.status === 401) {
        logOut();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${google_Maps_Api_Key}`
      );
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setMarkerPosition({ lat, lng });
        setPet((prevData) => ({
          ...prevData,
          location: { lat, lng },
        }));
        setGoogleMapsError("");
      } else {
        setGoogleMapsError("Address not found. Please try another.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    if (userId) getPetDetails();
  }, [userId]);

  const validatePetDetails = () => {
    const errors = {};
    if (!pet?.name) errors.name = "Name is required.";
    if (!pet?.age || pet?.age <= 0) errors.age = "Age must be a positive number.";
    if (!pet?.type) errors.type = "Type is required.";
    if (!pet?.sex) errors.sex = "Sex is required.";
    if (!pet?.description) errors.description = "Description is required.";
    if (!pet?.address) errors.address = "Address is required.";

    return errors;
  };

  const handleUpdate = async () => {
    const errors = validatePetDetails();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Prevent update if there are validation errors
    }

    try {
      await axios.put(`${backend_api}/user/${userId}/pet/${petId}/update`, pet, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Pet details updated successfully!");
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${backend_api}/user/${userId}/pet/${petId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status == 200) {
        setIsModalOpen(false);
        setIsPetDeletedModalOpen(true);
      }

      // console.log(response);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pet?.photoIds.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + pet?.photoIds.length) % pet?.photoIds.length
    );
  };

  return !isLogedIn ? (
    <LoginPage />
  ) : loading ? (
    <UserPetDetailsPageUI />
  ) : (
    <div className="bg-gradient-to-b from-blue-50 to-green-100 min-h-screen flex flex-col items-center p-4 md:p-6 lg:p-10">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-lg p-6 md:p-8 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-600 mb-6">
          {pet?.name}'s Profile
        </h1>

        {/* Image Slider */}
        {pet?.photoIds ? (
          <div className="relative mb-6">
            <button
              onClick={prevImage}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-full z-10"
            >
              ❮
            </button>
            <img
              src={pet?.photoIds[currentImageIndex]}
              loading="lazy"
              alt={pet?.name}
              className="w-full h-64 object-cover rounded-lg shadow-lg border-2 border-teal-200"
            />
            <button
              onClick={nextImage}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-full z-10"
            >
              ❯
            </button>
          </div>
        ) : (
          <></>
        )}

        {/* Pet Details */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-teal-700 mb-2">Edit Details</h2>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Name:</strong>
            </label>
            <input
              type="text"
              value={pet?.name}
              onChange={(e) => setPet({ ...pet, name: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {validationErrors.name && <p className="text-red-500">{validationErrors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Age:</strong>
            </label>
            <input
              type="number"
              value={pet?.age}
              onChange={(e) => setPet({ ...pet, age: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {validationErrors.age && <p className="text-red-500">{validationErrors.age}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Type:</strong>
            </label>
            <input
              type="text"
              value={pet?.type}
              onChange={(e) => setPet({ ...pet, type: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {validationErrors.type && <p className="text-red-500">{validationErrors.type}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Sex:</strong>
            </label>
            <input
              type="text"
              value={pet?.sex}
              onChange={(e) => setPet({ ...pet, sex: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {validationErrors.sex && <p className="text-red-500">{validationErrors.sex}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Description:</strong>
            </label>
            <textarea
              value={pet?.description}
              onChange={(e) => setPet({ ...pet, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="3"
            />
            {validationErrors.description && (
              <p className="text-red-500">{validationErrors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Address:</strong>
            </label>
            <input
              type="text"
              value={pet?.address}
              onChange={(e) => setPet({ ...pet, address: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {validationErrors.address && <p className="text-red-500">{validationErrors.address}</p>}
          </div>

          {/* Google Map */}
          <LoadScript googleMapsApiKey={google_Maps_Api_Key}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={markerPosition} zoom={12}>
              <Marker position={markerPosition} onDragEnd={handleMarkerDragEnd} draggable={true} />
            </GoogleMap>
          </LoadScript>

          {/* <button
            // onClick={handleUpdate}
            className="mt-6 w-full bg-teal-600 text-white py-2 rounded-full hover:bg-teal-500"
          >
            Update Pet Details
          </button> */}

          <button
            onClick={() => setIsModalOpen(true)} // Show modal on delete click
            className="mt-2 w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-500"
          >
            Delete Pet
          </button>
        </div>

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this pet?</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-4 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isPetDeletedModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Pet Deleted</h2>
              <p className="text-gray-600 mb-6">Your pet has been deleted successfully!</p>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setIsPetDeletedModalOpen(false);
                    navigate("/user/pets");
                  }}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetails;
