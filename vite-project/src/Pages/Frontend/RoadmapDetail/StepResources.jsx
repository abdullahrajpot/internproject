import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoadmapById } from '../../../data/roadmapData';

export default function StepResources() {
  const { roadmapId, stepId } = useParams();
  const navigate = useNavigate();
  const roadmap = getRoadmapById(Number(roadmapId));
  const step = roadmap?.steps.find(s => s.id === Number(stepId));

  // Watched state for videos
  const [watched, setWatched] = useState({});
  // Notes state
  const [notes, setNotes] = useState('');

  // Load watched and notes from localStorage
  useEffect(() => {
    const watchedKey = `watched-${roadmapId}-${stepId}`;
    const notesKey = `notes-${roadmapId}-${stepId}`;
    const savedWatched = localStorage.getItem(watchedKey);
    if (savedWatched) setWatched(JSON.parse(savedWatched));
    const savedNotes = localStorage.getItem(notesKey);
    if (savedNotes) setNotes(savedNotes);
  }, [roadmapId, stepId]);

  // Toggle watched state
  const toggleWatched = idx => {
    const watchedKey = `watched-${roadmapId}-${stepId}`;
    const updated = { ...watched, [idx]: !watched[idx] };
    setWatched(updated);
    localStorage.setItem(watchedKey, JSON.stringify(updated));
  };

  // Save notes
  const handleNotesChange = e => {
    setNotes(e.target.value);
    localStorage.setItem(`notes-${roadmapId}-${stepId}`, e.target.value);
  };

  if (!step) return <div className="text-white p-8">Step not found</div>;

  // Progress calculation
  const totalVideos = step.resources ? step.resources.length : 0;
  const watchedCount = Object.values(watched).filter(Boolean).length;
  const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-400">&larr; Back</button>
      <h1 className="text-2xl font-bold mb-4">{step.title} - Resources</h1>
      {/* Progress Bar */}
      {totalVideos > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Watched Videos</span>
            <span className="text-sm">{watchedCount}/{totalVideos}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}% Complete</p>
        </div>
      )}
      {step.resources && step.resources.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {step.resources.map((res, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{res.title}</h2>
                <button
                  onClick={() => toggleWatched(idx)}
                  className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${watched[idx] ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  {watched[idx] ? 'Watched ✔' : 'Mark as Watched'}
                </button>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={res.url}
                  title={res.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No video resources available for this topic.</p>
      )}
      {/* Notes Section */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Your Notes</h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          className="w-full h-32 p-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
} 