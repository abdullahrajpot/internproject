import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import "./ProfileDropdown.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const role = user?.role;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // for outside click
  const dropdownNodeRef = useRef(null); // for CSSTransition
  const mobileMenuRef = useRef(null); // for mobile menu
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          MyBrand
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex space-x-6">
          <Link to="/" className="hover:text-orange-400 transition-colors font-medium">Home</Link>
          <Link to="/about" className="hover:text-orange-400 transition-colors font-medium">About</Link>
          <Link to="/internship" className="hover:text-orange-400 transition-colors font-medium">Internships</Link>
          <Link to="/services" className="hover:text-orange-400 transition-colors font-medium">Services</Link>
          <Link to="/roadmap" className="hover:text-orange-400 transition-colors font-medium">RoadMap</Link>
        </nav>

        {/* Desktop Auth Buttons */}
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
                  nodeRef={dropdownNodeRef}
                >
                  <div
                    ref={dropdownNodeRef}
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-orange-400 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <CSSTransition
        in={mobileMenuOpen}
        timeout={300}
        classNames="mobile-menu"
        unmountOnExit
        nodeRef={mobileMenuRef}
      >
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-gray-800 border-t border-gray-700"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="block px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors font-medium"
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors font-medium"
                onClick={handleLinkClick}
              >
                About
              </Link>
              <Link 
                to="/internship" 
                className="block px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors font-medium"
                onClick={handleLinkClick}
              >
                Internships
              </Link>
              <Link 
                to="/services" 
                className="block px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors font-medium"
                onClick={handleLinkClick}
              >
                Services
              </Link>
              <Link 
                to="/roadmap" 
                className="block px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors font-medium"
                onClick={handleLinkClick}
              >
                RoadMap
              </Link>
            </nav>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-700">
              {!isAuthenticated ? (
                <div className="py-2">
                  <Link to="/auth" onClick={handleLinkClick}>
                    <button className="w-full px-4 py-3 my-1 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-black transition">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/auth/register" onClick={handleLinkClick}>
                    <button className="w-full px-4 py-2 my-1 bg-orange-500 text-black font-semibold rounded hover:bg-orange-600 transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.[0]?.toUpperCase() || <FaUser />}
                    </div>
                    <span className="text-white font-medium">{user?.name || 'User'}</span>
                  </div>
                  
                  {/* Profile Options */}
                  <button
                    className="w-full text-left px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => {
                      navigate("/profile");
                      handleLinkClick();
                    }}
                  >
                    <FaUser className="text-orange-500" /> Profile
                  </button>
                  
                  {role === "admin" && (
                    <button
                      className="w-full text-left px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => {
                        navigate("/dashboard");
                        handleLinkClick();
                      }}
                    >
                      Dashboard
                    </button>
                  )}
                  
                  {role === "intern" && (
                    <button
                      className="w-full text-left px-3 py-2 text-white hover:text-orange-400 hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => {
                        navigate("/interndashboard");
                        handleLinkClick();
                      }}
                    >
                      LMS
                    </button>
                  )}
                  
                  <button
                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CSSTransition>
    </header>
  );
};

export default Header;