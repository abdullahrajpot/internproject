<<<<<<< HEAD
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Bookmark, BookmarkCheck, Code, Server, Smartphone, Database, Cloud, Zap, Users, Brain, Shield } from 'lucide-react';
import { getAllRoadmaps } from '../../../data/roadmapData';
import { useAuth } from '../../../Contexts/AuthContext';

=======
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Bookmark, BookmarkCheck, Code, Server, Smartphone, Database, Cloud, Zap, Users, Brain, Shield } from 'lucide-react';
import { getAllRoadmaps } from '../../../data/roadmapData';
>>>>>>> origin/pdf_generator
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
  const {isAuthenticated} = useAuth();;
  const [selectedCategory, setSelectedCategory] = useState('All Roadmaps');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [filteredRoadmaps, setFilteredRoadmaps] = useState([]);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Get roadmap data from the data file
  const roadmaps = getAllRoadmaps();

  const categories = [
    'All Roadmaps',
    'Absolute Beginners',
    'Web Development',
    'Frameworks',
    'Languages / Platforms',
    'DevOps',
    'Mobile Development'
  ];

  const toggleBookmark = (id) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedItems(newBookmarks);
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

  useEffect(() => {
    let filtered = roadmaps;

    if (selectedCategory !== 'All Roadmaps') {
      filtered = filtered.filter(roadmap => roadmap.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(roadmap =>
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRoadmaps(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Roadmaps</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Browse the ever-growing list of up-to-date, community driven roadmaps
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link to='/roadmap-generator'>
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Generate Roadmap with AI
                </button>
              </Link>
              {/* <button className="px-8 py-3 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600 transition-all duration-300 border border-gray-600">
                Generate Roadmaps with AI
              </button> */}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Filter by Category</h3>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${selectedCategory === category
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{selectedCategory}</h2>
              <p className="text-gray-400">{filteredRoadmaps.length} roadmaps found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  onClick={() => handleRoadmapClick(roadmap.id)}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${roadmap.color} text-white shadow-lg`}>
                      {React.createElement(iconMap[roadmap.icon], { className: "w-6 h-6" })}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(roadmap.id);
                      }}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {bookmarkedItems.has(roadmap.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {roadmap.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(roadmap.difficulty)}`}>
                      {roadmap.difficulty}
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-400 text-sm">{roadmap.duration}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {roadmap.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {roadmap.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-md text-xs">
                        +{roadmap.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-grow"></div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoadmapClick(roadmap.id);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Learning
                  </button>
                </div>

              ))}
            </div>

            {/* Empty State */}
            {filteredRoadmaps.length === 0 && (
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