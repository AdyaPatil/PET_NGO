import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Description */}
          <div className="text-center md:text-left md:w-1/3">
            <img loading="lazy" src={logo} alt="Logo" className="h-10 w-10 mb-2 mx-auto md:mx-0" />
            <p className="text-sm">
              Pet NGO is dedicated to finding loving homes for pets in need. Join us in making a
              difference.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 text-center">
            <Link to="/" className="text-sm hover:text-white transition">
              Home
            </Link>
            <Link to="/about-us" className="text-sm hover:text-white transition">
              About Us
            </Link>
            <Link to="/" className="text-sm hover:text-white transition">
              Services
            </Link>
            <Link to="/contact-us" className="text-sm hover:text-white transition">
              Contact Us
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4 justify-center md:w-1/3">
            <Link to="#" className="hover:text-white transition">
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.46 6c-.77 1.15-1.64 2.2-2.6 3.1.02.14.02.28.02.42 0 4.34-3.3 9.34-9.34 9.34-1.86 0-3.6-.55-5.06-1.5h.64c1.54 0 2.96-.53 4.1-1.42a3.3 3.3 0 01-3.08-2.28c.46.1.9.1 1.38 0a3.3 3.3 0 01-2.64-3.25v-.04c.44.24.94.38 1.48.4a3.3 3.3 0 01-1.47-2.73c0-.6.16-1.16.44-1.64a9.38 9.38 0 006.8 3.46c-.16-.28-.22-.6-.22-.92 0-1.2.97-2.18 2.17-2.18.64 0 1.2.27 1.6.72a6.42 6.42 0 002.1-.8 2.17 2.17 0 01-.96 1.2c.64-.08 1.26-.24 1.84-.48-.44.62-.98 1.16-1.6 1.6z" />
              </svg>
            </Link>
            <Link to="#" className="hover:text-white transition">
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.75 0H5.25C2.35 0 0 2.35 0 5.25v13.5C0 21.65 2.35 24 5.25 24h13.5c2.9 0 5.25-2.35 5.25-5.25V5.25C24 2.35 21.65 0 18.75 0zm-8.5 18.75h-3.5v-8.5h3.5v8.5zm-1.75-9.75c-1 0-1.75-.75-1.75-1.75s.75-1.75 1.75-1.75 1.75.75 1.75 1.75-.75 1.75-1.75 1.75zm11 9.75h-3.5v-4.25c0-1 .75-1.75 1.75-1.75s1.75.75 1.75 1.75v4.25z" />
              </svg>
            </Link>
            <Link to="#" className="hover:text-white transition">
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.24 3.388 9.663 8.002 11.184-.11-.95-.203-2.407.043-3.44.22-.96 1.42-6.12 1.42-6.12s-.36-.72-.36-1.78c0-1.68.98-2.94 2.2-2.94 1.04 0 1.55.78 1.55 1.7 0 1.02-.66 2.54-1 3.94-.28 1.16.6 2.1 1.78 2.1 2.14 0 3.76-2.24 3.76-5.44 0-2.86-2.05-4.86-5.02-4.86-3.42 0-5.42 2.57-5.42 5.22 0 1.04.4 2.16.96 2.76.1.12.12.22.1.34-.1.36-.34 1.18-.38 1.34-.06.2-.2.26-.44.16-1.66-.78-2.68-3.3-2.68-5.3 0-4.32 3.22-8.34 9.3-8.34 4.88 0 8.18 3.5 8.18 7.24 0 4.9-3.12 8.52-7.46 8.52-1.44 0-2.8-.74-3.26-1.62l-.88 3.3c-.3 1.18-1.1 2.66-1.64 3.56C10.72 23.8 11.36 24 12 24c6.63 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className="text-center mt-6 md:mt-8 text-sm text-gray-500">
          © 2024 Pet NGO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
