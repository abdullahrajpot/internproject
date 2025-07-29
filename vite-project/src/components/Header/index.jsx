import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaUser } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import "./ProfileDropdown.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const role = user?.role;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // for outside click
  const dropdownNodeRef = useRef(null); // for CSSTransition
  const navigate = useNavigate ? useNavigate() : () => {};

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          MyBrand
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex space-x-6">
          <Link to="/" className="hover:text-orange-400 transition-colors font-medium">Home</Link>
          <Link to="/about" className="hover:text-orange-400 transition-colors font-medium">About</Link>
          <Link to="/internship" className="hover:text-orange-400 transition-colors font-medium">Internships</Link>
          <Link to="/services" className="hover:text-orange-400 transition-colors font-medium">Services</Link>
          <Link to="/roadmap" className="hover:text-orange-400 transition-colors font-medium">RoadMap</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex space-x-4 items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/auth">
                <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-black transition">
                  Sign In
                </button>
              </Link>
              <Link to="/auth/register">
                <button className="px-4 py-2 bg-orange-500 text-black font-semibold rounded hover:bg-orange-600 transition">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Profile Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:ring-4 hover:ring-orange-300 focus:outline-none transition-all duration-200"
                  onClick={() => setDropdownOpen((v) => !v)}
                  title="Profile"
                >
                  {user?.name?.[0]?.toUpperCase() || <FaUser />}
                </button>
                <CSSTransition
                  in={dropdownOpen}
                  timeout={200}
                  classNames="dropdown"
                  unmountOnExit
                  nodeRef={dropdownNodeRef} // <-- fix for React 18+
                >
                  <div
                    ref={dropdownNodeRef} // <-- fix for React 18+
                    className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-xl shadow-2xl py-2 z-50 min-w-max border border-gray-100 animate-fadeIn"
                  >
                    <button
                      className="w-full text-left px-5 py-3 hover:bg-orange-50 font-semibold flex items-center gap-2 transition-colors rounded-t-xl"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      <FaUser className="text-orange-500" /> Profile
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    {role === "admin" && (
                      <button
                        className="w-full text-left px-5 py-3 hover:bg-orange-50 flex items-center gap-2 transition-colors"
                        onClick={() => {
                          navigate("/dashboard");
                          setDropdownOpen(false);
                        }}
                      >
                        Dashboard
                      </button>
                    )}
                    {role === "intern" && (
                      <button
                        className="w-full text-left px-5 py-3 hover:bg-orange-50 flex items-center gap-2 transition-colors"
                        onClick={() => {
                          navigate("/interndashboard");
                          setDropdownOpen(false);
                        }}
                      >
                        LMS
                      </button>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors rounded-b-xl"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </CSSTransition>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
