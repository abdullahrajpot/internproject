import React, { useState, useEffect, useRef } from 'react';
import {
  FaEnvelope,
  FaBullhorn,
  FaUsers,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaPaperPlane,
  FaUserCircle,
  FaCheckDouble,
  FaTrash,
  FaClock,
  FaFilter,
  FaExclamationCircle,
  FaRegSmile,
  FaPaperclip,
  FaMicrophone,
  FaVideo,
  FaPhoneAlt,
  FaEllipsisV,
  FaChevronLeft,
  FaImage,
  FaFileAlt
} from 'react-icons/fa';
import { useSettings } from '../../Contexts/SettingsContext';
import {
  fetchConversations,
  fetchConversation,
  sendMessage,
  fetchAnnouncements,
  createAnnouncement,
  markMessageAsRead,
  fetchUsers,
  deleteMessage
} from '../../utils/api';

export default function Communications() {
  const { formatDate } = useSettings();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [composeData, setComposeData] = useState({
    receiverId: '',
    subject: '',
    content: '',
    type: 'message'
  });
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Get current user role and ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setCurrentUserId(payload.id);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  useEffect(() => {
    if (selectedConversation) {
      loadConversation(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'messages') {
        const res = await fetchConversations();
        if (res.success) setConversations(res.data.data);
      } else if (activeTab === 'announcements') {
        const res = await fetchAnnouncements();
        if (res.success) setAnnouncements(res.data.data);
      }

      // Load all users for compose modal
      const usersRes = await fetchUsers();
      if (usersRes.success) {
        // Filter out current user if possible, or just keep all for now
        setAllUsers(usersRes.data);
      }
    } catch (err) {
      setError('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const res = await fetchConversation(userId);
      if (res.success) {
        setMessages(res.data.data);

        // Mark messages as read
        const unreadMessages = res.data.data.filter(
          msg => !msg.isRead && msg.receiver?._id === currentUserId
        );

        if (unreadMessages.length > 0) {
          // Mark each unread message as read
          await Promise.all(unreadMessages.map(msg => markMessageAsRead(msg._id)));

          // Clear unread count locally in conversations list
          setConversations(prev => prev.map(c =>
            c.user._id === userId ? { ...c, unreadCount: 0 } : c
          ));

          // Also update the messages state to reflect they are read
          setMessages(prev => prev.map(msg =>
            msg.receiver?._id === currentUserId ? { ...msg, isRead: true } : msg
          ));
        }
      }
    } catch (err) {
      setError('Failed to load conversation');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, { url: reader.result, name: file.name, type: 'image' }]);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreviews(prev => [...prev, { name: file.name, type: 'file' }]);
      }
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('receiverId', selectedConversation.user._id);
      formData.append('subject', `Message to ${selectedConversation.user.name}`);
      formData.append('content', newMessage);
      formData.append('type', 'message');

      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const res = await sendMessage(formData);

      if (res.success) {
        setMessages([...messages, res.data.data]);
        setNewMessage('');
        setSelectedFiles([]);
        setFilePreviews([]);
        // Update conversation list locally
        setConversations(prev => prev.map(c =>
          c.user._id === selectedConversation.user._id
            ? { ...c, lastMessage: res.data.data }
            : c
        ));
      }
    } catch (err) {
      console.error('Send error detail:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to send message';
      setError(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await deleteMessage(messageId);
      if (res.success) {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      }
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    if (!composeData.content.trim()) return;

    setIsSending(true);
    try {
      let res;
      if (composeData.type === 'announcement') {
        res = await createAnnouncement({
          subject: composeData.subject,
          content: composeData.content,
          targetRole: composeData.receiverId || 'all'
        });
      } else {
        res = await sendMessage({
          receiverId: composeData.receiverId,
          subject: composeData.subject,
          content: composeData.content,
          type: 'message'
        });
      }

      if (res.success) {
        setShowComposeModal(false);
        setComposeData({ receiverId: '', subject: '', content: '', type: 'message' });
        loadInitialData(); // Refresh list
      }
    } catch (err) {
      setError('Failed to compose communication');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await deleteMessage(id);
      if (res.success) {
        if (type === 'message') {
          setMessages(messages.filter(m => m._id !== id));
        } else {
          setAnnouncements(announcements.filter(a => a._id !== id));
        }
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-20px)] lg:h-[calc(100vh-32px)] m-0 bg-[#F8F9FD] flex flex-col font-sans overflow-hidden lg:rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
      {/* Search & Compose Header (Visible on Mobile or as Utility) */}
      <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        <button onClick={() => setShowComposeModal(true)} className="p-2 bg-blue-600 text-white rounded-full"><FaPaperPlane /></button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversation List */}
        <div className={`w-full lg:w-[380px] bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${selectedConversation && 'hidden lg:flex'}`}>
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1a1c1e]">Messages</h1>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-gray-600"><FaSearch className="w-5 h-5" /></button>
                <button onClick={() => setShowComposeModal(true)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#F1F4F9] p-1 rounded-xl mb-6">
              {[
                { id: 'messages', label: activeTab === 'messages' ? 'Direct' : 'Users' },
                { id: 'announcements', label: 'Broadcasts' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedConversation(null);
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {loading ? (
              <div className="flex justify-center p-8"><FaSpinner className="animate-spin text-blue-500" /></div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center p-8 text-gray-400"><p>No results found</p></div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.user._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`group relative p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 mx-2 ${selectedConversation?.user._id === conv.user._id
                    ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100'
                    : 'hover:bg-gray-50 border border-transparent'
                    }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold border-2 border-white shadow-sm">
                      {conv.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-[#1a1c1e] truncate">{conv.user.name}</h4>
                      <span className="text-[11px] text-gray-400">
                        {formatDate(conv.lastMessage.createdAt, { onlyTime: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate pr-4">{conv.lastMessage.content}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full scale-90">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Chat Window */}
        <div className={`flex-1 flex flex-col bg-[#F8F9FD] min-w-0 transition-all ${!selectedConversation && 'hidden lg:flex'}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-24 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedConversation(null)} className="lg:hidden p-2 text-gray-400"><FaChevronLeft /></button>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {selectedConversation.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1c1e] text-lg">{selectedConversation.user.name}</h3>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-6 text-gray-400">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FaVideo className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FaPhoneAlt className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FaSearch className="w-5 h-5" /></button>
                  <div className="w-px h-6 bg-gray-100"></div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-100 hover:text-red-500"><FaTrash className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FaEllipsisV className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8F9FD]">
                {messages.map((msg, i) => {
                  const isSentByMe = msg.sender._id === currentUserId;
                  const showAvatar = i === 0 || messages[i - 1].sender._id !== msg.sender._id;

                  return (
                    <div key={msg._id} className={`flex gap-4 ${isSentByMe ? 'flex-row-reverse' : 'flex-row'} items-end group`}>
                      {/* Avatar next to bubble */}
                      <div className={`w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center ${isSentByMe ? 'bg-blue-600 text-white' : 'bg-white shadow-sm text-blue-600 border border-gray-100'
                        }`}>
                        {showAvatar ? msg.sender.name.charAt(0).toUpperCase() : ''}
                      </div>

                      <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'} max-w-[65%]`}>
                        {/* External Timestamp */}
                        <span className="text-[10px] text-gray-400 mb-1 px-1">
                          {formatDate(msg.createdAt, { onlyTime: true }).toLowerCase()}
                        </span>

                        <div className={`relative p-4 rounded-2xl shadow-sm ${isSentByMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          }`}>
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.attachments.map((file, idx) => (
                                <a
                                  key={idx}
                                  href={`http://localhost:5000${file.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 p-2 rounded-lg text-xs ${isSentByMe ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                                    }`}
                                >
                                  {file.fileType.startsWith('image/') ? <FaImage /> : <FaFileAlt />}
                                  <span className="truncate max-w-[150px]">{file.name}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Delete Action on Hover */}
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className={`absolute top-0 ${isSentByMe ? '-left-10' : '-right-10'} p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity`}
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>

                        {isSentByMe && (
                          <div className="mt-1 flex items-center">
                            <FaCheckDouble className={`w-3 h-3 ${msg.isRead ? 'text-blue-500' : 'text-gray-300'}`} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-8 bg-white/80 backdrop-blur-md border-t border-gray-100">
                {filePreviews.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-3">
                    {filePreviews.map((file, i) => (
                      <div key={i} className="relative group bg-gray-50 border border-gray-100 rounded-xl p-2 pr-8">
                        {file.type === 'image' ? (
                          <img src={file.url} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500"><FaFileAlt /></div>
                        )}
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-white shadow-sm border border-gray-100 rounded-full text-gray-400 hover:text-red-500 flex items-center justify-center text-xs"
                        >&times;</button>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                  <div className="flex-1 bg-[#F1F4F9] rounded-2xl px-6 flex items-center gap-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md">
                    <button type="button" className="text-gray-400 hover:text-gray-600"><FaRegSmile className="w-5 h-5" /></button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaPaperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />

                    <textarea
                      rows="1"
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none py-4 text-sm focus:ring-0 text-gray-800 placeholder-gray-400 resize-none min-h-[50px] max-h-[150px]"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />

                    <button type="button" className="text-gray-400 hover:text-gray-600"><FaMicrophone className="w-5 h-5" /></button>
                  </div>

                  <button
                    disabled={isSending || (!newMessage.trim() && selectedFiles.length === 0)}
                    className="h-[54px] px-8 bg-blue-600 text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                  >
                    {isSending ? <FaSpinner className="animate-spin" /> : (
                      <>
                        <span>Send</span>
                        <FaPaperPlane className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="bg-white p-16 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center max-w-sm text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8">
                  <FaEnvelope className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Message</h3>
                <p className="text-gray-500">Choose a colleague or intern from the sidebar to start a new professional conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-white">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">New Message</h3>
                <p className="text-blue-100 text-sm mt-1">Select recipient and type your message</p>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl"
              >&times;</button>
            </div>

            <form onSubmit={handleComposeSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Recipient</label>
                <select
                  required
                  className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 py-4 transition-all"
                  value={composeData.receiverId}
                  onChange={(e) => setComposeData({ ...composeData, receiverId: e.target.value })}
                >
                  <option value="">Select a user...</option>
                  {allUsers
                    .filter(u => {
                      if (userRole === 'intern') return u.role === 'admin';
                      return u._id !== currentUserId;
                    })
                    .map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 py-4"
                  placeholder="What is this about?"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Message Content</label>
                <textarea
                  required
                  rows="4"
                  className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 py-4"
                  placeholder="Write your message here..."
                  value={composeData.content}
                  onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={isSending || !composeData.content.trim()}
                  className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSending ? <FaSpinner className="animate-spin" /> : (
                    <>
                      <span>Send Message</span>
                      <FaPaperPlane className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-[100]">
          <FaExclamationCircle />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => setError(null)} className="ml-4 font-bold opacity-60 hover:opacity-100">&times;</button>
        </div>
      )}
    </div>
  );
}