import axios from "axios";
import React, { useContext, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { google_Maps_Api_Key } from "../../config/config.json";
import { backend_api } from "../../config/config.json";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

const CreatePet = () => {
  const { isLogedIn, userId, token, logOut } = useContext(LoginContext);
  const navigate = useNavigate();

  const [petData, setPetData] = useState({
    name: "",
    age: "",
    type: "",
    description: "",
    gender: "",
    address: "",
    location: null,
  });

  const [errors, setErrors] = useState({});
  const [petPhotos, setPetPhotos] = useState([]);
  const [images, setImages] = useState([]);
  const [docsPrivew, setDocsPriview] = useState([]);
  const [docs, setDocs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [createdPetId, setCreatedPetId] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [googleMapsError, setGoogleMapsError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear field-specific errors
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
        setPetData((prevData) => ({
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

  const handleMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    setPetData((prevData) => ({
      ...prevData,
      location: { lat: newLat, lng: newLng },
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPetPhotos(newPhotos);
  };

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocs(files);
    const newDocs = files.map((file) => URL.createObjectURL(file));
    setDocsPriview(newDocs);
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!petData.name) newErrors.name = "Pet name is required";
    if (!petData.age || isNaN(petData.age)) newErrors.age = "Valid age is required";
    if (!petData.type) newErrors.type = "Pet type is required";
    if (!petData.description) newErrors.description = "Description is required";
    if (!petData.gender) newErrors.gender = "Please select the pet's gender";
    if (!petData.address) newErrors.address = "Address is required";
    if (!petData.location) newErrors.location = "Location is required";
    if (images.length === 0) newErrors.images = "At least one photo is required";
    // if (docs.length === 0) newErrors.docs = "Vaccination documents are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent submit if validation fails

    setLoading(true); // Show loading modal

    const formData = new FormData();
    formData.append("name", petData.name);
    formData.append("age", petData.age);
    formData.append("type", petData.type);
    formData.append("description", petData.description);
    formData.append("sex", petData.gender);
    formData.append("address", petData.address);
    formData.append("lat", petData?.location?.lat);
    formData.append("lng", petData?.location?.lng);

    images.forEach((file) => formData.append("images", file));
    docs.forEach((file) => formData.append("vaccination_docs", file));

    try {
      const response = await axios.post(`${backend_api}/user/${userId}/create-pet`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCreatedPetId(response?.data?.created?.id);
      setShowPopup(true);
      setLoading(false); // Hide loading modal
      setTimeout(() => {
        navigate(`/user/pet/${response?.data?.created?.id}`);
      }, 2000);
    } catch (error) {
      if (error?.response?.status === 401) {
        logOut();
        navigate("/login");
      }
      if (error?.response?.status === 400) {
        setError(error?.response?.data?.detail);
      }
      setLoading(false); // Hide loading modal
    }
  };

  return !isLogedIn ? (
    <LoginPage />
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-200 to-blue-500 p-4">
      <div className="card p-6 rounded-lg shadow-lg bg-white w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
          Create Your Pet Listing
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pet Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Pet Name</label>
            <input
              name="name"
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
              value={petData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          {/* Pet Type */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Pet Type</label>
            <input
              name="type"
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
              value={petData.type}
              onChange={handleChange}
            />
            {errors.type && <p className="text-red-500">{errors.type}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Gender</label>
            <select
              name="gender"
              value={petData.gender}
              onChange={handleChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Age</label>
            <input
              name="age"
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
              value={petData.age}
              onChange={handleChange}
            />
            {errors.age && <p className="text-red-500">{errors.age}</p>}
          </div>
        </div>

        {/* Pet Description */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            name="description"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
            value={petData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2 mt-6">
          <label className="block text-gray-700 font-bold mb-2">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
            onChange={handlePhotoUpload}
          />
          {errors.images && <p className="text-red-500">{errors.images}</p>}
          <div className="flex flex-wrap mt-2 gap-2">
            {petPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Pet Preview ${index}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Vaccination Docs Upload */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Upload Vaccination Documents</label>
          <input
            type="file"
            accept=".pdf,.docx, image/*"
            multiple
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
            onChange={handleDocumentsUpload}
          />
          {errors.docs && <p className="text-red-500">{errors.docs}</p>}
          <div className="flex flex-wrap mt-2 gap-2">
            {docsPrivew.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600"
              >
                View Document {index + 1}
              </a>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Address</label>
          <input
            name="address"
            type="text"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-orange-500"
            value={petData.address}
            onChange={handleChange}
            onBlur={() => fetchCoordinates(petData.address)}
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}
          {googleMapsError && <p className="text-red-500">{googleMapsError}</p>}
        </div>

        {/* Google Maps */}
        <div className="mt-6">
          <LoadScript googleMapsApiKey={google_Maps_Api_Key}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={markerPosition}
              zoom={12}
              onClick={(e) => setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
            >
              <Marker position={markerPosition} draggable={true} onDragEnd={handleMarkerDragEnd} />
            </GoogleMap>
          </LoadScript>
          {errors.location && <p className="text-red-500">{errors.location}</p>}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
          >
            Create Pet
          </button>
        </div>

        {/* Loading Modal */}
        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                Creating Pet, please wait...
              </h2>
              <p className="text-gray-700">This may take a few seconds.</p>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold text-green-600 mb-4">Pet Created Successfully!</h2>
              <p className="text-gray-700">Redirecting to the pet details page...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePet;
