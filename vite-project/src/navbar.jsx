import React from "react";

const Navbar = () => {
  return (
   <>
   <header className="p-4 bg-coolGray-100 text-coolGray-800 w-full">
        <div className="container flex justify-between h-16 mx-auto">
          <a
            href="#"
            aria-label="Back to homepage"
            className="flex items-center p-2"
          >
            <div>
              <h1 className="font-bold text-orange-600">Logo</h1>
            </div>
          </a>
          <ul className="items-stretch hidden space-x-3 lg:flex">
            <li className="flex">
              <a
                href="#"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent text-orange-600 font-bold"
            >
                Link
              </a>
            </li>
            <li className="flex">
              <a
                href="#"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent text-orange-600 font-bold"
              >
                Link
              </a>
            </li>
            <li className="flex">
              <a
                href="#"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent text-orange-600 font-bold"
              >
                Link
              </a>
            </li>
            <li className="flex">
              <a
                href="#"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent text-orange-600 font-bold"
              >
                Link
              </a>
            </li>
          </ul>
          <div className="items-center flex-shrink-0 hidden lg:flex">
            <button className="self-center px-8 py-3 rounded text-orange-600 font-bold cursor-pointer">Sign in</button>
            <button className="self-center px-8 py-3 rounded font-bold bg-orange-600 text-black cursor-pointer">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </header>
   </>
  );
};

export default Navbar;