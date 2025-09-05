import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoadmapById } from '../../../data/roadmapData';
import { useAuth } from '../../../Contexts/AuthContext';
import { useUserProgress } from '../../../hooks/useUserProgress';
import { BookmarkIcon, PlayIcon, PauseIcon, ClockIcon, CheckCircleIcon, EditIcon, TrashIcon } from 'lucide-react';

export default function StepResources() {
  const { roadmapId, stepId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { progress, updateRoadmapVideoProgress, addRoadmapVideoNote, editRoadmapVideoNote, deleteRoadmapVideoNote, toggleVideoBookmark } = useUserProgress();
  
  const roadmap = getRoadmapById(Number(roadmapId));
  const step = roadmap?.steps.find(s => s.id === Number(stepId));

  // Local state
  const [videoProgress, setVideoProgress] = useState({});
  const [videoNotes, setVideoNotes] = useState({});
  const [currentVideoTime, setCurrentVideoTime] = useState({});
  const [newNote, setNewNote] = useState('');
  const [selectedVideoForNote, setSelectedVideoForNote] = useState(null);
  const [noteTimestamp, setNoteTimestamp] = useState(0);
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Get roadmap progress from backend
  const roadmapProgress = progress?.roadmaps?.find(r => r.roadmapId === roadmapId);
  const stepProgress = roadmapProgress?.steps?.find(s => s.stepId === stepId);

  // Load progress and notes from backend
  useEffect(() => {
    if (isAuthenticated && stepProgress) {
      const progressData = {};
      const notesData = {};
      
      stepProgress.videos?.forEach(video => {
        progressData[video.videoId] = {
          watchedDuration: video.watchedDuration,
          completed: video.completed,
          bookmarked: video.bookmarked
        };
        notesData[video.videoId] = video.notes || [];
      });
      
      setVideoProgress(progressData);
      setVideoNotes(notesData);
    }
  }, [isAuthenticated, stepProgress]);

  // Toggle video completion
  const toggleVideoCompletion = async (videoIndex) => {
    if (!isAuthenticated) {
      alert('Please log in to track progress');
      return;
    }

    const videoId = `${stepId}-${videoIndex}`;
    const currentProgress = videoProgress[videoId] || {};
    const newCompleted = !currentProgress.completed;
    
    try {
      await updateRoadmapVideoProgress(
        roadmapId,
        stepId,
        videoId,
        newCompleted ? 600 : currentProgress.watchedDuration || 0, // Assume 10 min if completed
        newCompleted,
        5 // 5 minutes time spent
      );
      
      setVideoProgress(prev => ({
        ...prev,
        [videoId]: {
          ...currentProgress,
          completed: newCompleted,
          watchedDuration: newCompleted ? 600 : currentProgress.watchedDuration || 0
        }
      }));
    } catch (error) {
      console.error('Error updating video progress:', error);
      alert('Failed to update progress');
    }
  };

  // Add note to video
  const handleAddNote = async () => {
    if (!isAuthenticated || !selectedVideoForNote || !newNote.trim()) {
      return;
    }

    try {
      const note = await addRoadmapVideoNote(
        roadmapId,
        stepId,
        selectedVideoForNote,
        noteTimestamp,
        newNote.trim()
      );
      
      setVideoNotes(prev => ({
        ...prev,
        [selectedVideoForNote]: [...(prev[selectedVideoForNote] || []), note]
      }));
      
      setNewNote('');
      setSelectedVideoForNote(null);
      setNoteTimestamp(0);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  // Toggle video bookmark
  const handleToggleBookmark = async (videoIndex) => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark videos');
      return;
    }

    const videoId = `${stepId}-${videoIndex}`;
    try {
      await toggleVideoBookmark(roadmapId, stepId, videoId);
      
      setVideoProgress(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          bookmarked: !prev[videoId]?.bookmarked
        }
      }));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Edit note handlers
  const handleEditNote = (note) => {
    setEditingNote(note._id || note.timestamp);
    setEditNoteContent(note.content);
  };

  const handleSaveEditNote = async (videoId, noteId) => {
    if (!editNoteContent.trim()) return;

    try {
      await editRoadmapVideoNote(roadmapId, stepId, videoId, noteId, editNoteContent.trim());
      
      setVideoNotes(prev => ({
        ...prev,
        [videoId]: prev[videoId].map(note => 
          (note._id || note.timestamp) === noteId 
            ? { ...note, content: editNoteContent.trim(), updatedAt: new Date() }
            : note
        )
      }));
      
      handleCancelEdit();
    } catch (error) {
      console.error('Error editing note:', error);
      alert('Failed to edit note');
    }
  };

  const handleDeleteNote = async (videoId, noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteRoadmapVideoNote(roadmapId, stepId, videoId, noteId);
      
      setVideoNotes(prev => ({
        ...prev,
        [videoId]: prev[videoId].filter(note => (note._id || note.timestamp) !== noteId)
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditNoteContent('');
  };

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!step) return <div className="text-white p-8">Step not found</div>;

  // Progress calculation
  const totalVideos = step?.resources ? step.resources.length : 0;
  const completedVideos = Object.values(videoProgress).filter(v => v.completed).length;
  const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-400">&larr; Back</button>
      <h1 className="text-2xl font-bold mb-4">{step.title} - Resources</h1>
      {/* Progress Bar */}
      {totalVideos > 0 && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Step Progress</span>
            <span className="text-sm bg-blue-600 px-2 py-1 rounded">{completedVideos}/{totalVideos} completed</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-400">{progressPercentage}% Complete</p>
            {progressPercentage === 100 && (
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircleIcon size={16} />
                Step Completed!
              </span>
            )}
          </div>
        </div>
      )}
      {step?.resources && step.resources.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {step.resources.map((res, idx) => {
            const videoId = `${stepId}-${idx}`;
            const progress = videoProgress[videoId] || {};
            const notes = videoNotes[videoId] || [];
            
            return (
              <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                {/* Video Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{res.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ClockIcon size={14} />
                      <span>~10 minutes</span>
                      {progress.completed && (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircleIcon size={14} />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleBookmark(idx)}
                      className={`p-2 rounded-lg transition-colors ${
                        progress.bookmarked 
                          ? 'bg-yellow-600 text-yellow-100' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={progress.bookmarked ? 'Remove bookmark' : 'Bookmark video'}
                    >
                      <BookmarkIcon size={16} />
                    </button>
                    
                    <button
                      onClick={() => toggleVideoCompletion(idx)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        progress.completed 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {progress.completed ? 'Completed ✓' : 'Mark Complete'}
                    </button>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative mb-4">
                  <iframe
                    src={res.url}
                    title={res.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 rounded-lg"
                  ></iframe>
                  
                  {/* Progress overlay */}
                  {progress.watchedDuration > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      Watched: {formatTime(progress.watchedDuration)}
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Notes ({notes.length})</h4>
                    <button
                      onClick={() => {
                        setSelectedVideoForNote(videoId);
                        setNoteTimestamp(Math.floor(Math.random() * 600)); // Random timestamp for demo
                      }}
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                    >
                      Add Note
                    </button>
                  </div>
                  
                  {/* Existing Notes */}
                  {notes.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {notes.map((note, noteIdx) => (
                        <div key={note._id || noteIdx} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <ClockIcon size={12} />
                              <span>{formatTime(note.timestamp)}</span>
                              {note.updatedAt && (
                                <span className="text-yellow-400">(edited)</span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="text-blue-400 hover:text-blue-300 p-1"
                                title="Edit note"
                              >
                                <EditIcon size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(videoId, note._id || noteIdx)}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Delete note"
                              >
                                <TrashIcon size={12} />
                              </button>
                            </div>
                          </div>
                          
                          {editingNote === (note._id || noteIdx) ? (
                            <div className="space-y-2">
                              <textarea
                                value={editNoteContent}
                                onChange={(e) => setEditNoteContent(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm resize-none"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEditNote(videoId, note._id || noteIdx)}
                                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{note.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Note Form */}
                  {selectedVideoForNote === videoId && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                        <ClockIcon size={12} />
                        <span>At {formatTime(noteTimestamp)}</span>
                      </div>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add your note..."
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm resize-none"
                        rows="2"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleAddNote}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                        >
                          Save Note
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVideoForNote(null);
                            setNewNote('');
                          }}
                          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No video resources available for this step.</p>
        </div>
      )}
      {/* Step Summary */}
      {isAuthenticated && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Step Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-2xl font-bold text-blue-400">{totalVideos}</div>
              <div className="text-sm text-gray-400">Total Videos</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-2xl font-bold text-green-400">{completedVideos}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-400">
                {Object.values(videoProgress).filter(v => v.bookmarked).length}
              </div>
              <div className="text-sm text-gray-400">Bookmarked</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-2xl font-bold text-purple-400">
                {Object.values(videoNotes).reduce((total, notes) => total + notes.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Notes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 