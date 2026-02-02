import React, { useState, useEffect } from 'react';
import {
  FaChartLine,
  FaUsers,
  FaTasks,
  FaDownload,
  FaArrowUp,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';

export default function Analytics() {
  const [loading, setLoading] = useState(true);

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
          <p className="text-gray-600 text-lg">Loading analytics data...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your platform performance</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <FaDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">12.5%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Internees</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">45</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">8.3%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FaUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">234</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">15.7%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FaTasks className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">78.5%</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">5.2%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <FaCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for charts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <FaChartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Charts will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Advanced analytics coming soon</p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Health</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">120ms</div>
              <div className="text-sm text-gray-500">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">0.1%</div>
              <div className="text-sm text-gray-500">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">42</div>
              <div className="text-sm text-gray-500">Active Connections</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}