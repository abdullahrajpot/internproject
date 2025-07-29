import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FaUser, FaEdit, FaRegCopy } from "react-icons/fa";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl w-full flex flex-col gap-8 border border-gray-100 relative">
        {/* Edit Button */}
        <button className="absolute top-8 right-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2">
          <FaEdit /> EDIT
        </button>
        {/* Top Section: Avatar + Name/Email */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-7xl shadow">
            <FaUser />
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="text-3xl font-bold text-gray-800 mb-1">{user?.name}</div>
            <div className="text-lg text-gray-500 mb-2">{user?.email}</div>
          </div>
        </div>
        {/* Form Fields (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Full Name</label>
            <input type="text" value={user?.name || ''} readOnly className="w-full border rounded px-4 py-3 text-gray-600 bg-gray-50" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input type="text" value={user?.email || ''} readOnly className="w-full border rounded px-4 py-3 text-gray-600 bg-gray-50" />
          </div>
          {/* Add more fields as needed, e.g. phone, address, etc. */}
        </div>
        {/* Email Section with Small Avatar */}
        <div className="mt-8">
          <div className="font-bold text-lg mb-2 text-gray-900">My email Address</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl">
              {user?.name?.[0]?.toLowerCase() || <FaUser />}
            </div>
            <span className="text-gray-700 text-lg">{user?.email}</span>
          </div>
        </div>
        {/* Credentials Section */}
        <div className="mt-8 w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-gray-700 font-medium">
              <span>User ID:</span>
              <span>{user?.id || user?._id || '-'}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Role:</span>
              <span className="capitalize">{user?.role || '-'}</span>
            </div>
            {/* Add more user credentials here if available */}
          </div>
        </div>
      </div>
    </div>
  );
} 