import React from "react";

const Navbar = () => {
  return (
    <header className="p-4 bg-coolGray-100 text-coolGray-800 w-full">
      <div className="container flex justify-between h-16 mx-auto">
        <a href="#" aria-label="Back to homepage" className="flex items-center p-2">
          {/* SVG Logo (optional — you can remove if not needed) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 32 32"
            className="w-8 h-8 text-blue-600"
          >
            <path d="..."></path>
            <path d="..."></path>
          </svg>
        </a>

        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <a href="#" className="flex items-center px-4 -mb-1 border-b-2 border-transparent">
              Link
            </a>
          </li>
          {/* Add more links here */}
        </ul>

        <div className="items-center flex-shrink-0 hidden lg:flex">
          <button className="self-center px-8 py-3 rounded">Sign in</button>
          <button className="self-center px-8 py-3 font-semibold rounded bg-blue-600 text-white">
            Sign up
          </button>
        </div>

        <button className="p-4 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-coolGray-800"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;