import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { google_Maps_Api_Key, backend_api } from "../../config/config.json";
import PetInformationPageUI from "../ShimmerUI/PetInformationPageUI";

const PetInfo = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = pet?.photoIds?.length || 0;
  // console.log(petId);
  // Load the Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_Maps_Api_Key,
  });

  const getPetDetails = async () => {
    try {
      const response = await axios.get(`${backend_api}/pet/${petId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(`${backend_api}/pet/${petId}`);
      setPet(response?.data?.petinfo);
    } catch (error) {
      console.error("Error fetching pet details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPetDetails();
  }, [petId]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  return loading ? (
    <PetInformationPageUI />
  ) : (
    <div className="container mx-auto py-6 px-4">
      {/* Ad Strip at the Top */}
      <div className="bg-teal-200 text-center p-3 mb-6 rounded-lg shadow-md">
        <p className="text-lg md:text-xl font-bold">Support Our NGO! Adopt a Pet Today!</p>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-teal-600">
        {pet?.name}'s Profile
      </h1>

      {/* Image Slider */}
      {pet?.photoIds ? (
        <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
          <div className="flex-1 flex items-center justify-center relative w-full">
            <button
              onClick={prevImage}
              hidden={pet?.photoIds.length == 1 ? true : false}
              className="absolute left-2 md:left-0 bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-500 transition-colors duration-300 z-10"
            >
              ❮
            </button>
            <img
              src={pet?.photoIds[currentImageIndex]}
              loading="lazy"
              alt={pet?.name}
              className="w-full h-60 md:w-fit md:h-[500px] object-cover rounded-lg shadow-lg border-2 border-teal-200"
            />
            <button
              onClick={nextImage}
              hidden={pet?.photoIds.length == 1 ? true : false}
              className="absolute right-2 md:right-0 bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-500 transition-colors duration-300 z-10"
            >
              ❯
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Pet Details */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-4 border-b-2 border-teal-300">
            Details
          </h2>
          <p className="mb-2">
            <strong>Age:</strong> {pet?.age} years
          </p>
          <p className="mb-2">
            <strong>Type:</strong> {pet?.type}
          </p>
          <p className="mb-2">
            <strong>Sex:</strong> {pet?.sex}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {pet?.description}
          </p>
          <p className="mb-4">
            <strong>Address:</strong> {pet?.address}
          </p>

          {/* Vaccination Status */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-2">
              Vaccination Status
            </h2>
            {pet?.docsIds?.length > 0 ? (
              <div>
                <p className="mb-2 text-green-600">The pet is vaccinated.</p>
                <a
                  href={pet?.docsIds[currentImageIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Vaccination Document
                </a>
              </div>
            ) : (
              <p className="text-red-600">The pet is not vaccinated.</p>
            )}
          </div>

          {/* Google Maps Integration */}
          {isLoaded && pet?.location && (
            <div className="my-4 md:my-6">
              <h2 className="text-xl md:text-2xl font-semibold text-teal-700 mb-4">Location</h2>
              <div className="w-full h-64 md:h-96">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{ lat: pet.location.lat, lng: pet.location.lng }}
                  zoom={12}
                >
                  <Marker position={{ lat: pet.location.lat, lng: pet.location.lng }} />
                </GoogleMap>
              </div>
            </div>
          )}

          {/* Owner Information */}
          <div className="bg-teal-50 shadow-lg rounded-lg p-4 mt-4">
            <h2 className="text-lg md:text-xl font-semibold text-teal-700 mb-2 border-b-2 border-teal-300">
              Owner Information
            </h2>
            <p>
              <strong>Name:</strong> {pet?.user_info?.name}
            </p>
            <p>
              <strong>Phone:</strong> {pet?.user_info?.phone}
            </p>
            <p>
              <strong>Address:</strong> {pet?.address}
            </p>
          </div>
        </div>
      </div>

      {/* Ad Strip at the Bottom */}
      <div className="bg-teal-200 text-center p-3 mt-6 rounded-lg shadow-md">
        <p className="text-lg md:text-xl font-bold">Become a Volunteer! Help Us Save More Lives!</p>
      </div>
    </div>
  );
};

export default PetInfo;
