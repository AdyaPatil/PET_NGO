import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import GoogleAd from "./GoogleAdComponent";
import { backend_api } from "../../config/config.json";
import PetListPageUI from "../ShimmerUI/PetListPageUI";

const PetList = () => {
  const location = useLocation();
  const { searchBarFilter } = location.state || {};
  const [pets, setPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState({});
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter visibility
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1);

  const getPetList = async (value) => {
    setLoading(true); // Set loading state
    try {
      // console.log("api call");
      console.log(value);
      const params = new URLSearchParams(value).toString();
      const url = value
        ? `${backend_api}/pets/search?${params}&page=${currentPage - 1}`
        : `${backend_api}/pets/search?page=${currentPage - 1}`;
      // console.log(url);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPets(response?.data?.pets);
      // console.log(response?.data?.pets);
      const indices = {};
      response?.data?.pets?.forEach((pet) => {
        indices[pet._id] = 0;
      });
      setCurrentIndex(indices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleNextPage = () => {
    if (pets.length == 9) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleNext = (petId) => {
    setCurrentIndex((prev) => {
      const nextIndex = (prev[petId] + 1) % pets.find((pet) => pet._id === petId).photoIds.length;
      return { ...prev, [petId]: nextIndex };
    });
  };

  const handlePrev = (petId) => {
    setCurrentIndex((prev) => {
      const pet = pets?.find((pet) => pet._id === petId);
      const nextIndex = (prev[petId] - 1 + pet.photoIds.length) % pet.photoIds.length;
      return { ...prev, [petId]: nextIndex };
    });
  };

  const insertAds = (pets) => {
    const adBox = {
      id: "ad-box",
      content: <GoogleAd />,
    };
    const updatedPets = [];

    pets.forEach((pet, index) => {
      updatedPets.push(pet);
      if ((index + 1) % 3 === 0) {
        updatedPets.push(adBox);
      }
    });

    return updatedPets;
  };

  const displayedPets = insertAds(pets);

  useEffect(() => {
    searchBarFilter ? getPetList({ search: searchBarFilter }) : getPetList(filters);
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, [currentPage, location]);

  return (
    <div className="mx-auto py-10 px-4 md:px-10 bg-gradient-to-b from-orange-200 to-yellow-200">
      <h1 className="text-5xl font-bold text-center mb-8 text-orange-500">Adopt a Friend</h1>
      <p className="text-lg text-center text-gray-600 mb-6">
        Find your perfect pet companion today!
      </p>

      {/* Filter Section */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="bg-orange-500 text-white px-4 py-2 mb-4 hover:bg-orange-400 transition-colors duration-300 w-full"
      >
        {isFilterOpen ? "Close Filters" : "Open Filters"}
      </button>

      {isFilterOpen && (
        <div className="mb-6 bg-gray-200 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Name"
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none"
            />
            <input
              type="number"
              name="age"
              value={filters.age}
              onChange={handleFilterChange}
              placeholder="Age"
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none"
            />
            <input
              type="text"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              placeholder="Type (e.g., Dog, Cat)"
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none"
            />
            <input
              type="text"
              name="sex"
              value={filters.sex}
              onChange={handleFilterChange}
              placeholder="Sex"
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none"
            />
            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Address"
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none"
            />
          </div>
          <button
            onClick={() => getPetList(filters)}
            className="bg-orange-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-orange-400 transition-colors duration-300"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setFilters({ name: "", type: "", sex: "", address: "", age: "" });
              location.state = {};
              getPetList();
            }}
            className="bg-orange-500 text-white px-4 py-2 ml-2 rounded-full mt-4 hover:bg-orange-400 transition-colors duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <PetListPageUI />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPets?.map((item) =>
            item.id === "ad-box" ? (
              <div
                key={item.id}
                className="bg-yellow-100 shadow-lg rounded-lg overflow-hidden p-6 text-center"
              >
                <h2 className="text-2xl font-semibold mb-2">{item.content}</h2>
                <button className="bg-teal-600 text-white py-2 px-4 rounded-full hover:bg-teal-500 transition-colors duration-300">
                  Learn More
                </button>
              </div>
            ) : (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <div className="relative">
                  {item?.photoIds ? (
                    item?.photoIds?.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200"
                          onClick={() => handlePrev(item._id)}
                        >
                          ❮
                        </button>
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200"
                          onClick={() => handleNext(item._id)}
                        >
                          ❯
                        </button>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                  {item?.photoIds ? (
                    <img
                      src={item?.photoIds[currentIndex[item?._id] || 0]}
                      loading="lazy"
                      alt={item.name}
                      className="w-full h-72 object-cover"
                    />
                  ) : (
                    <></>
                  )}
                </div>

                <Link to={`/pet/${item._id}`} target="_blank">
                  <div className="p-6 bg-teal-50">
                    <h2 className="text-2xl font-semibold text-teal-700 mb-2">{item.name}</h2>
                    <p className="text-teal-600 mb-2">Age: {item.age} years</p>
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      )}
      <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg max-w-sm mx-auto mt-8">
        {/* Previous Button */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md bg-teal-400 text-white font-semibold hover:bg-teal-500 transition-colors duration-200 ease-in-out ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>

        {/* Page Number Display */}
        <div className="text-gray-700 font-bold">{currentPage}</div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={pets.length < 9}
          className={`px-4 py-2 rounded-md bg-teal-400 text-white font-semibold hover:bg-teal-500 transition-colors duration-200 ease-in-out ${
            pets.length < 9 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PetList;
