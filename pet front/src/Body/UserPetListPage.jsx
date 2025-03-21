import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import axios from "axios";
import LoginPage from "./LoginPage";
import { backend_api } from "../../config/config.json";
import UserPetListPageUI from "../ShimmerUI/UserPetListPageUI";

function PetList() {
  const navigate = useNavigate();
  const { isLogedIn, userId, token, logOut } = useContext(LoginContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPetData = async () => {
    try {
      const response = await axios.get(`${backend_api}/user/${userId}/pets`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPets(response?.data?.petlist);
    } catch (error) {
      if (error?.response?.status === 401) {
        logOut();
        navigate("/login");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getPetData();
    }
  }, [userId]);

  return !isLogedIn ? (
    <LoginPage />
  ) : (
    <div className="bg-gradient-to-b from-light-blue-50 to-light-green-100 min-h-screen flex flex-col items-center p-6 md:p-10">
      {/* Ad Strip */}
      <div className="bg-yellow-300 text-center p-4 mb-6 w-full">
        <h3 className="font-bold text-lg">Ad: Adopt a Pet Today!</h3>
      </div>

      <h2 className="text-4xl font-bold text-center text-green-600 mb-6">Your Added Pets</h2>
      {loading ? (
        <UserPetListPageUI />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="relative">
                  <img
                    src={pet?.photoIds?.[0]}
                    loading="lazy"
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                </div>
                <Link to={`/user/pet/${pet?.id}`}>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-green-600">{pet.name}</h3>
                  <p className="text-gray-600">{pet.type}</p>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-lg text-gray-700">No pets found. Please add some!</div>
          )}
        </div>
      )}

      {/* Ad Strip at Bottom */}
      <div className="bg-yellow-300 text-center p-4 mt-6 w-full">
        <h3 className="font-bold text-lg">Ad: Support Your Local Animal Shelter!</h3>
      </div>
    </div>
  );
}

export default PetList;
