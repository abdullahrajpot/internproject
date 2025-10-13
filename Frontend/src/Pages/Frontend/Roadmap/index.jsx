import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Bookmark, BookmarkCheck, Code, Server, Smartphone, Database, Cloud, Zap, Users, Brain, Shield } from 'lucide-react';
import { useAuth } from '../../../Contexts/AuthContext';
import { useUserProgress } from '../../../hooks/useUserProgress';
import { getAllRoadmaps } from '../../../data/roadmapData';

import { useAuth } from '../../../Contexts/AuthContext';

// Icon mapping
const iconMap = {
  Code: Code,
  Server: Server,
  Smartphone: Smartphone,
  Database: Database,
  Cloud: Cloud,
  Zap: Zap,
  Users: Users,
  Brain: Brain,
  Shield: Shield
};

const Roadmap = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { progress, enrollInRoadmap, toggleRoadmapBookmark } = useUserProgress();

  // Debug authentication
  console.log('Is authenticated:', isAuthenticated);
  console.log('Progress data:', progress);
  const [selectedCategory, setSelectedCategory] = useState('All Roadmaps');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoadmaps, setFilteredRoadmaps] = useState([]);
  const [enrolling, setEnrolling] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const categories = [
    'All Roadmaps',
    'Web Development',
    'Frameworks',
    'Languages / Platforms',
    'DevOps',
    'Mobile Development',
    'Database',
    'Cloud Computing'
  ];

  const handleBookmarkToggle = async (roadmapId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      await toggleRoadmapBookmark(roadmapId);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleRoadmapClick = (roadmapId) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    navigate(`/roadmap/${roadmapId}`);
  };

  const handleEnrollClick = async (roadmapId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to enroll in roadmaps');
      navigate('/auth');
      return;
    }

    try {
      setEnrolling(prev => new Set(prev).add(roadmapId));
      await enrollInRoadmap(roadmapId);
      navigate(`/roadmap/${roadmapId}`);
    } catch (error) {
      console.error('Error enrolling in roadmap:', error);
      if (error.message === 'Not authenticated') {
        alert('Please log in to enroll in roadmaps');
        navigate('/auth');
      } else {
        alert(error.message || 'Failed to enroll in roadmap');
      }
    } finally {
      setEnrolling(prev => {
        const newSet = new Set(prev);
        newSet.delete(roadmapId);
        return newSet;
      });
    }
  };

  const isEnrolled = (roadmapId) => {
    return progress?.roadmaps?.some(r => r.roadmapId === roadmapId.toString()) || false;
  };

  const isBookmarked = (roadmapId) => {
    const roadmap = progress?.roadmaps?.find(r => r.roadmapId === roadmapId.toString());
    return roadmap?.bookmarked || false;
  };

  const getRoadmapProgress = (roadmapId) => {
    const roadmap = progress?.roadmaps?.find(r => r.roadmapId === roadmapId.toString());
    return roadmap?.progressPercentage || 0;
  };

  useEffect(() => {
    // Get all roadmaps from local data
    const roadmaps = getAllRoadmaps();
    let filtered = roadmaps;

    if (selectedCategory !== 'All Roadmaps') {
      filtered = filtered.filter(roadmap => roadmap.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(roadmap =>
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRoadmaps(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Roadmaps</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Browse the ever-growing list of up-to-date, community driven roadmaps
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
              <Link to='/roadmap-generator' className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Generate Roadmap with AI
                </button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto px-4">
              <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="w-full flex items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Filter by Category</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${showMobileFilter ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Sidebar */}
          <div className={`lg:w-1/4 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Filter className="w-5 h-5 text-orange-500" />
                <h3 className="text-base sm:text-lg font-semibold">Filter by Category</h3>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowMobileFilter(false); // Close mobile filter after selection
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmaps Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedCategory}</h2>
              <p className="text-gray-400 text-sm sm:text-base">
                {loading ? 'Loading...' : `${filteredRoadmaps.length} roadmaps found`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  onClick={() => handleRoadmapClick(roadmap.id)}
                  className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${roadmap.color} text-white shadow-lg`}>
                      {React.createElement(iconMap[roadmap.icon] || Code, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </div>
                    <button
                      onClick={(e) => handleBookmarkToggle(roadmap.id, e)}
                      className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                    >
                      {isBookmarked(roadmap.id) ? (
                        <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                      ) : (
                        <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-gray-400 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                    {roadmap.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(roadmap.difficulty)}`}>
                      {roadmap.difficulty}
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{roadmap.duration}</span>
                  </div>

                  {/* Progress Bar for Enrolled Roadmaps */}
                  {isEnrolled(roadmap.id) && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-orange-400">{getRoadmapProgress(roadmap.id)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getRoadmapProgress(roadmap.id)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {roadmap.skills?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {roadmap.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-md text-xs">
                        +{roadmap.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Steps Count */}
                  <div className="mb-4">
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {roadmap.totalSteps} steps • {roadmap.steps.reduce((total, step) => total + (step.resources?.length || 0), 0)} videos
                    </span>
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-grow"></div>

                  {/* Action Button */}
                  {isEnrolled(roadmap.id) ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoadmapClick(roadmap.id);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleEnrollClick(roadmap.id, e)}
                      disabled={enrolling.has(roadmap.id)}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {enrolling.has(roadmap.id) ? 'Enrolling...' : 'Start Learning'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRoadmaps.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-gray-500 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;