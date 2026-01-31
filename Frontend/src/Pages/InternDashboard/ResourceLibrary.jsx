import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaBook, FaCode, FaFileAlt, FaSearch, FaQuestionCircle } from 'react-icons/fa';

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/resources'); // Adjust URL if your backend is on a different port/domain
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResources(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = [...new Set(resources.map(res => res.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper function to get the correct icon based on fileType
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FaFilePdf className="text-red-500" size={24} />;
      case 'doc': return <FaFileAlt className="text-blue-500" size={24} />;
      case 'ppt': return <FaFileAlt className="text-orange-500" size={24} />;
      case 'xls': return <FaFileAlt className="text-green-500" size={24} />;
      case 'zip': return <FaCode className="text-purple-500" size={24} />;
      case 'img': return <FaFileAlt className="text-yellow-500" size={24} />;
      default: return <FaFileAlt className="text-gray-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl min-h-[calc(100vh-120px)] flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl min-h-[calc(100vh-120px)] flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <p className="text-gray-600">Please ensure the backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl min-h-[calc(100vh-120px)]">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-3">Resource Library</h1>
      <p className="text-gray-600 mb-8">
        Explore a curated collection of documents, guides, and templates to support your internship journey.
      </p>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Resources Display */}
      {filteredResources.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-xl mb-2">No resources found.</p>
          <p>Try adjusting your search term or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <div
              key={resource._id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center mb-3">
                {getFileIcon(resource.fileType)}
                <h3 className="text-xl font-semibold text-gray-800 ml-3">{resource.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3 flex-grow">{resource.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{resource.category}</span>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                >
                  View
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}