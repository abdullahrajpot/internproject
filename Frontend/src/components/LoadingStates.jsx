import React from 'react';
import { FaSpinner, FaCircleNotch, FaCog } from 'react-icons/fa';

// Full page loading
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  </div>
);

// Card/Section loading
export const SectionLoader = ({ message = "Loading...", className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${className}`}>
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin w-6 h-6 text-blue-500 mr-3" />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

// Inline loading (for buttons, etc.)
export const InlineLoader = ({ size = "sm", className = "" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <FaSpinner className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Card loading skeleton
export const CardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Chart loading skeleton
export const ChartSkeleton = ({ height = "300px" }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
      <div 
        className="bg-gray-100 rounded"
        style={{ height }}
      >
        <div className="flex items-end justify-center h-full p-4 space-x-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-t"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                width: '20px'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Button loading state
export const LoadingButton = ({ 
  loading = false, 
  children, 
  className = "", 
  disabled = false,
  ...props 
}) => (
  <button
    className={`flex items-center justify-center gap-2 ${className} ${
      loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={loading || disabled}
    {...props}
  >
    {loading && <InlineLoader size="sm" />}
    {children}
  </button>
);

// Processing overlay
export const ProcessingOverlay = ({ message = "Processing...", show = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl">
        <div className="text-center">
          <FaCog className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">{message}</p>
          <p className="text-gray-500 text-sm mt-2">Please wait...</p>
        </div>
      </div>
    </div>
  );
};

// Data loading states
export const EmptyState = ({ 
  icon: Icon = null, 
  title = "No data available", 
  description = "", 
  action = null 
}) => (
  <div className="text-center py-12">
    {Icon && <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-4">{description}</p>}
    {action}
  </div>
);

export default {
  PageLoader,
  SectionLoader,
  InlineLoader,
  TableSkeleton,
  CardSkeleton,
  ChartSkeleton,
  LoadingButton,
  ProcessingOverlay,
  EmptyState
};