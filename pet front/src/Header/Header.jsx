import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import logo from "../../public/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLogedIn, logOut } = useContext(LoginContext);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    navigate("/pets", { state: { searchBarFilter: searchText.trim() } });
  };

  useEffect(() => {}, [isLogedIn]);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* Logo Section */}
        <Link to="/" className="text-xl md:text-3xl font-bold flex items-center">
          <img
            src={logo}
            loading="lazy"
            alt="Logo"
            className="h-8 w-8 md:h-12 md:w-12 inline-block mr-2"
          />
          <span>FurryFriends</span>
        </Link>

        {/* Search Section (hidden on mobile) */}
        <div className="hidden md:flex flex-grow mx-4 items-center">
          <input
            type="text"
            placeholder="Search by breed, age"
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-700 mx-2 hover:text-orange-500 transition">
            Home
          </Link>
          {isLogedIn ? (
            <>
              <Link
                to="/user-profile"
                className="text-gray-700 mx-2 hover:text-orange-500 transition"
              >
                My Account
              </Link>
              <Link to="/user/pets" className="text-gray-700 mx-2 hover:text-orange-500 transition">
                My Pets
              </Link>
              <button
                onClick={() => {
                  logOut();
                  navigate("/");
                }}
                className="text-gray-700 mx-2 hover:text-orange-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about-us" className="text-gray-700 mx-2 hover:text-orange-500 transition">
                About Us
              </Link>
              <Link to="/login" className="text-gray-700 mx-2 hover:text-orange-500 transition">
                Login/Register
              </Link>
            </>
          )}
          <Link to="/contact-us" className="text-gray-700 mx-2 hover:text-orange-500 transition">
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="block md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Search Section */}
      <div className="md:hidden flex px-4 py-2 items-center bg-white">
        <input
          type="text"
          placeholder="Search by breed, age"
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition"
        >
          Search
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-orange-500 transition">
            Home
          </Link>
          {isLogedIn ? (
            <>
              <Link
                to="/user-profile"
                className="block text-gray-700 hover:text-orange-500 transition"
              >
                My Account
              </Link>
              <button
                onClick={() => {
                  logOut();
                  navigate("/");
                }}
                className="block text-gray-700 hover:text-orange-500 transition"
              >
                Logout
              </button>
              <Link
                to="/user/pets"
                className="block text-gray-700 hover:text-orange-500 transition"
              >
                My Pets
              </Link>
            </>
          ) : (
            <>
              <Link to="/about-us" className="block text-gray-700 hover:text-orange-500 transition">
                About Us
              </Link>
              <Link to="/login" className="block text-gray-700 hover:text-orange-500 transition">
                Login/Register
              </Link>
            </>
          )}
          <Link to="/contact-us" className="block text-gray-700 hover:text-orange-500 transition">
            Contact Us
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
