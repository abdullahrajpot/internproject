import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoadmapById } from '../../../data/roadmapData';
import { useAuth } from '../../../Contexts/AuthContext';
import { useUserProgress } from '../../../hooks/useUserProgress';
import { handleDownloadPDF } from '../../../components/pdfGenerator/pdfGenerator';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { progress, enrollInRoadmap, toggleRoadmapBookmark } = useUserProgress();
  
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Get roadmap progress from backend
  const roadmapProgress = progress?.roadmaps?.find(r => r.roadmapId === id);
  const isEnrolled = !!roadmapProgress;

  useEffect(() => {
    const roadmap = getRoadmapById(parseInt(id));
    if (roadmap) {
      setRoadmapData(roadmap);
      setIsBookmarked(roadmapProgress?.bookmarked || false);
      
      // Set completed steps from backend progress
      if (roadmapProgress?.steps) {
        const completed = new Set(
          roadmapProgress.steps
            .filter(step => step.completed)
            .map(step => parseInt(step.stepId))
        );
        setCompletedSteps(completed);
      }
    } else {
      navigate('/roadmap');
    }
  }, [id, roadmapProgress, navigate]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      alert('Please log in to enroll in roadmaps');
      navigate('/auth');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInRoadmap(id);
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in roadmap');
    } finally {
      setEnrolling(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark roadmaps');
      return;
    }

    try {
      await toggleRoadmapBookmark(id);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleStepClick = (stepId) => {
    if (!isEnrolled) {
      alert('Please enroll first to access steps');
      return;
    }
    navigate(`/roadmap/${id}/step/${stepId}`);
  };

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Roadmap Not Found</h1>
          <p className="text-gray-400 mb-6">The roadmap you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/roadmap')}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
          >
            Back to Roadmaps
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = roadmapProgress?.progressPercentage || 0;
  const completedStepsCount = roadmapProgress?.completedSteps || 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button 
              onClick={() => navigate('/roadmap')} 
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{roadmapData.title}</h1>
              <p className="text-gray-400 text-xs sm:text-sm truncate hidden sm:block">{roadmapData.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={handleBookmarkToggle}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark roadmap'}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
            
            <button
              className="p-1.5 sm:p-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors"
              title="Share roadmap"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="w-full flex items-center justify-between bg-slate-700 rounded-lg p-3"
          >
            <span className="font-semibold">Roadmap Details</span>
            <svg 
              className={`w-5 h-5 transition-transform ${showMobileSidebar ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div className={`w-full lg:w-80 bg-slate-800 border-r border-slate-700 p-4 sm:p-6 ${showMobileSidebar ? 'block' : 'hidden lg:block'} lg:min-h-screen`}>
          {/* Progress Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Progress</h3>
            <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm text-gray-300">
                  {completedStepsCount}/{roadmapData.totalSteps}
                </span>
                <span className="text-xs sm:text-sm text-gray-300">{progressPercentage}% Complete</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs sm:text-sm">Difficulty:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                roadmapData.difficulty === 'Beginner' ? 'bg-green-600 text-green-100' :
                roadmapData.difficulty === 'Intermediate' ? 'bg-yellow-600 text-yellow-100' :
                'bg-red-600 text-red-100'
              }`}>
                {roadmapData.difficulty}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm">Duration:</span>
              <span className="text-xs sm:text-sm text-gray-300">{roadmapData.duration}</span>
            </div>
          </div>

          {/* Updated */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm">Updated:</span>
              <span className="text-xs sm:text-sm text-gray-300">{roadmapData.lastUpdated}</span>
            </div>
          </div>

          {/* Skills You'll Learn */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Skills You'll Learn</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {roadmapData.skills.map((skill, index) => (
                <span key={index} className="px-2 sm:px-3 py-1 bg-slate-700 text-gray-300 rounded text-xs sm:text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
              >
                {enrolling ? 'Enrolling...' : 'Start Learning'}
              </button>
            ) : (
              <div className="w-full py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-semibold text-center text-sm sm:text-base">
                ✓ Enrolled
              </div>
            )}
            
            <button
              onClick={() => handleDownloadPDF(roadmapData, setIsGeneratingPdf)}
              disabled={isGeneratingPdf}
              className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </button>
            
            <button className="w-full py-2 bg-slate-700 text-gray-300 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              View Resources
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg bg-gradient-to-r ${roadmapData.color} text-white text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4`}>
                📚
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{roadmapData.title} Roadmap</h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                Follow this step-by-step guide to master {roadmapData.title.toLowerCase()}
              </p>
            </div>

            {/* Roadmap Steps - Card Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {roadmapData.steps.map((step, index) => {
                const stepProgress = roadmapProgress?.steps?.find(s => s.stepId === step.id.toString());
                const stepCompleted = stepProgress?.completed || false;
                const stepProgressPercentage = stepProgress?.progressPercentage || 0;
                
                return (
                  <div 
                    key={step.id}
                    className={`relative p-4 sm:p-5 lg:p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:transform hover:scale-105 ${
                      stepCompleted
                        ? 'bg-slate-800 border-green-500/50 hover:bg-slate-700'
                        : stepProgressPercentage > 0
                        ? 'bg-slate-800 border-blue-500/50 hover:bg-slate-700'
                        : isEnrolled
                        ? 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                        : 'bg-slate-800/50 border-slate-600/50 cursor-not-allowed'
                    }`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    {/* Status Indicator */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold ${
                        stepCompleted
                          ? 'bg-green-500'
                          : stepProgressPercentage > 0
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                      }`}>
                        {stepCompleted ? '✓' : stepProgressPercentage > 0 ? '◐' : '○'}
                      </div>
                    </div>

                    {/* Step Icon */}
                    <div className="mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl">
                        🔵
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 text-white pr-8 sm:pr-10 lg:pr-12">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Topics Covered */}
                    {step.topics && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Topics Covered:</h4>
                        <div className="flex flex-wrap gap-1">
                          {step.topics.slice(0, 3).map((topic, topicIndex) => (
                            <span key={topicIndex} className="px-1.5 sm:px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs">
                              {topic}
                            </span>
                          ))}
                          {step.topics.length > 3 && (
                            <span className="px-1.5 sm:px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs">
                              +{step.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {isEnrolled && stepProgressPercentage > 0 && (
                      <div className="mb-3 sm:mb-4">
                        <div className="w-full bg-slate-600 rounded-full h-1.5 sm:h-2">
                          <div 
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                              stepCompleted ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${stepProgressPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {stepProgressPercentage}% complete
                        </div>
                      </div>
                    )}

                    {/* Bottom Info */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mt-auto mb-8 sm:mb-10">
                      <span>{step.resources?.length || 0} resources</span>
                      <span>{step.estimatedTime}</span>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                      <div className={`px-1.5 sm:px-2 py-1 rounded text-xs font-semibold ${
                        step.type === 'foundation' ? 'bg-blue-600 text-blue-100' :
                        step.type === 'core' ? 'bg-purple-600 text-purple-100' :
                        step.type === 'tool' ? 'bg-green-600 text-green-100' :
                        step.type === 'enhancement' ? 'bg-yellow-600 text-yellow-100' :
                        'bg-red-600 text-red-100'
                      }`}>
                        {step.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;