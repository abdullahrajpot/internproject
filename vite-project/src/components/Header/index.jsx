import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          MyBrand
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex space-x-6">
          <Link
            to="/"
            className="hover:text-orange-400 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-orange-400 transition-colors font-medium"
          >
            About
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex space-x-4">
          <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-black transition">
            Sign In
          </button>
          <button className="px-4 py-2 bg-orange-500 text-black font-semibold rounded hover:bg-orange-600 transition">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
