import React, { useState, useEffect } from 'react';
import {
  FaEnvelope,
  FaBullhorn,
  FaUsers,
  FaSearch,
  FaPlus,
  FaSpinner
} from 'react-icons/fa';

export default function Communications() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Communication Center</h1>
            <p className="text-gray-600 mt-1">Manage messages, announcements, and campaigns</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search communications..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
              />
            </div>
            
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <FaPlus className="w-4 h-4" />
              Compose Message
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'messages', label: 'Messages', icon: FaEnvelope },
            { id: 'announcements', label: 'Announcements', icon: FaBullhorn },
            { id: 'campaigns', label: 'Campaigns', icon: FaUsers }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-500">Message management system</p>
              <p className="text-sm text-gray-400 mt-2">Send messages to users and internees</p>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <FaBullhorn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Announcements</h3>
              <p className="text-gray-500">Create and manage system announcements</p>
              <p className="text-sm text-gray-400 mt-2">Broadcast important information to all users</p>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Campaigns</h3>
              <p className="text-gray-500">Campaign management coming soon</p>
              <p className="text-sm text-gray-400 mt-2">Create targeted email campaigns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}