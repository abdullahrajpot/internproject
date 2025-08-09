import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookmarkPlus, Share2, CheckCircle, Circle, Clock, Users, Target, Download, ExternalLink } from 'lucide-react';
import { getRoadmapById } from '../../../data/roadmapData';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState(new Set([1, 2, 3]));
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  useEffect(() => {
    const roadmap = getRoadmapById(parseInt(id));
    if (roadmap) {
      setRoadmapData(roadmap);
    } else {
      // If roadmap not found, redirect to roadmap list
      navigate('/roadmap');
    }
  }, [id, navigate]);

  const toggleStepCompletion = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getStepTypeColor = (type) => {
    switch (type) {
      case 'foundation': return 'bg-blue-500';
      case 'core': return 'bg-orange-500';
      case 'tool': return 'bg-green-500';
      case 'enhancement': return 'bg-purple-500';
      case 'advanced': return 'bg-red-500';
      case 'final': return 'bg-indigo-500';
      default: return 'bg-gray-500';
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

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading roadmap...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (completedSteps.size / roadmapData.totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/roadmap')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{roadmapData.title}</h1>
                <p className="text-gray-400 mt-1">{roadmapData.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-400">{completedSteps.size}/{roadmapData.totalSteps}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round(progressPercentage)}% Complete</p>
              </div>

              {/* Meta Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    <span className="text-gray-400">Difficulty:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(roadmapData.difficulty)}`}>
                      {roadmapData.difficulty}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    <span className="text-gray-400">Duration:</span> {roadmapData.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    <span className="text-gray-400">Updated:</span> {roadmapData.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Skills You'll Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {roadmapData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="w-full py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Resources
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${roadmapData.color} text-white shadow-lg mb-4`}>
                  {roadmapData.icon}
                </div>
                <h2 className="text-3xl font-bold mb-2">{roadmapData.title} Roadmap</h2>
                <p className="text-gray-400">Follow this step-by-step guide to master {roadmapData.title.toLowerCase()}</p>
              </div>

              {/* Roadmap Flow */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-600 h-full"></div>

                {/* Steps */}
                <div className="space-y-8">
                  {roadmapData.steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-center">
                      {/* Step Circle */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                        <button
                          onClick={() => toggleStepCompletion(step.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            completedSteps.has(step.id)
                              ? 'bg-orange-500 border-orange-500'
                              : 'bg-gray-800 border-gray-600 hover:border-orange-500'
                          }`}
                        >
                          {completedSteps.has(step.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>

                      {/* Step Content */}
                      <div 
                        className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'ml-auto pl-8'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/roadmap/${roadmapData.id}/step/${step.id}`)}
                      >
                        <div className={`bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-orange-500/50 transition-all duration-200 ${
                          completedSteps.has(step.id) ? 'border-orange-500/50 bg-gray-700/80' : ''
                        }`}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-3 h-3 rounded-full ${getStepTypeColor(step.type)}`}></div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-gray-300 mb-4">{step.description}</p>
                          
                          {/* Topics */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Topics Covered:</h4>
                            <div className="flex flex-wrap gap-1">
                              {step.topics.map((topic, topicIndex) => (
                                <span
                                  key={topicIndex}
                                  className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{step.resources ? step.resources.length : 0} resources</span>
                            <span>{step.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Completion Message */}
                <div className="mt-12 text-center">
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
                    <p className="text-gray-300">
                      You've completed the {roadmapData.title} roadmap! You're now ready to build amazing applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
