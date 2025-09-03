import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Pagination,
  Stack,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  Collapse
} from '@mui/material';
import {
  Delete,
  Edit,
  MoreVert,
  Search,
  FilterList,
  Add,
  CalendarToday,
  Flag,
  Person,
  Assignment,
  Refresh,
  ExpandMore,
  ExpandLess,
  AddCircle,
  RemoveCircle,
  CheckCircle,
  PauseCircle,
  PlayArrow,
  Schedule,
  AttachFile,
  Visibility,
  Download,
  ArrowBack,
  ViewList,
  ViewModule
} from '@mui/icons-material';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("list"); // list or cards
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  
  // Material-UI specific states
  const [error, setError] = useState('');
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  // Fetch tasks from API
  useEffect(() => {
    if (user?.id || user?._id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/task/assigned?internId=${user.id || user._id}`)
        .then((res) => {
          console.log('API Response:', res.data);

          const internTasks = res.data.filter(task => {
            const userId = user.id || user._id;
            const taskAssignedTo = task.assignedTo?._id || task.assignedTo?.id;
            const isAssigned = taskAssignedTo === userId || task.internId === userId;

            console.log('Task:', task.title, 'Assigned to:', taskAssignedTo, 'User:', userId, 'Match:', isAssigned);
            return isAssigned;
          });

          console.log('Filtered tasks:', internTasks);
          setTasks(internTasks);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setTasks([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Filter tasks based on active filter
  const getFilteredTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    let filtered = tasks;

    // Time-based filtering
    switch (activeFilter) {
      case "Today":
        filtered = tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= today && taskDate < tomorrow;
        });
        break;
      case "This Week":
        filtered = tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
        break;
      case "Overdue":
        filtered = tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate < today && task.status !== "Completed";
        });
        break;
      default:
        filtered = tasks;
    }

    // Status filtering
    if (selectedStatus !== "All") {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    // Priority filtering
    if (selectedPriority !== "All") {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignedBy && task.assignedBy.name && task.assignedBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "deadline":
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case "priority":
          const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          aValue = priorityOrder[a.priority] || 2;
          bValue = priorityOrder[b.priority] || 2;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const displayStatus = (task) => {
    const now = new Date();
    if (task.status === "Ongoing" && task.deadline && new Date(task.deadline) < now) {
      return "Overdue";
    }
    return task.status;
  };

  // Toggle expansion of task details
  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
      } else {
        newExpanded.add(taskId);
      }
      return newExpanded;
    });
  };

  const handleMenuClick = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = () => {
    if (selectedTask) {
      setNewStatus(selectedTask.status);
      setStatusDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleStatusSubmit = async () => {
    if (!selectedTask || !newStatus) return;

    setUpdatingStatus(true);
    try {
      await updateTaskStatus(selectedTask._id, newStatus);
      setStatusDialogOpen(false);
      setSelectedTask(null);
      setNewStatus('');
    } catch (error) {
      setError(`Failed to update task status: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle />;
      case 'Ongoing': case 'In Progress': return <PlayArrow />;
      case 'Pending': return <Schedule />;
      case 'On Hold': return <PauseCircle />;
      default: return <Assignment />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Ongoing': case 'In Progress': return 'info';
      case 'Pending': return 'warning';
      case 'On Hold': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Calculate progress based on task status
  const calculateProgress = (task) => {
    switch (task.status) {
      case 'Completed':
        return 100;
      case 'Ongoing':
      case 'In Progress':
        return task.progress || 50;
      case 'On Hold':
        return task.progress || 25;
      case 'Pending':
        return 0;
      default:
        return task.progress || 0;
    }
  };

  // View attachment function
  const viewAttachment = async (attachment) => {
    try {
      const rawUrl = attachment?.url || attachment?.fileUrl || attachment?.file_path || attachment?.path;
      if (!rawUrl) {
        setError('No file URL provided');
        return;
      }

      const viewUrl = `http://localhost:5000/${rawUrl}`;
      window.open(viewUrl, '_blank');
      
    } catch (error) {
      console.error('View attachment error:', error);
      setError(`Failed to view file: ${error.message}`);
    }
  };

  // Download attachment function
  const downloadAttachment = async (attachment) => {
    try {
      const rawUrl = attachment?.url || attachment?.fileUrl || attachment?.file_path || attachment?.path;
      if (!rawUrl) {
        setError('No file URL provided');
        return;
      }

      const link = document.createElement('a');
      link.href = `http://localhost:5000/${rawUrl}`;
      link.download = attachment.name || rawUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download attachment error:', error);
      setError(`Failed to download file: ${error.message}`);
    }
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate stats
  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => displayStatus(t) === "Completed").length;
  const ongoing = filteredTasks.filter((t) => displayStatus(t) === "Ongoing").length;
  const pending = filteredTasks.filter((t) => displayStatus(t) === "Pending").length;
  const overdue = filteredTasks.filter((t) => displayStatus(t) === "Overdue").length;
  
  // Group tasks for Kanban view
  const groupedTasks = {
    "Pending": filteredTasks.filter((t) => displayStatus(t) === "Pending"),
    "Ongoing": filteredTasks.filter((t) => displayStatus(t) === "Ongoing"),
    "Completed": filteredTasks.filter((t) => displayStatus(t) === "Completed"),
    "Overdue": filteredTasks.filter((t) => displayStatus(t) === "Overdue"),
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      console.log('Updating task status:', taskId, 'to:', newStatus);

      const response = await axios.patch(`http://localhost:5000/api/task/update-status/${taskId}`, {
        status: newStatus
      });

      console.log('Status update response:', response.data);

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      setError('');
    } catch (error) {
      console.error('Error updating task status:', error);

      try {
        const response = await axios.put(`http://localhost:5000/api/task/${taskId}`, {
          status: newStatus
        });

        console.log('PUT Status update response:', response.data);

        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );

        setError('');
      } catch (putError) {
        console.error('Both PATCH and PUT failed:', putError);
        setError('Failed to update task status. Please try again.');
        throw putError;
      }
    } finally {
      setUpdating(null);
    }
  };

  const downloadFile = async (task) => {
    if (!task.file) {
      setError('No file attached to this task');
      return;
    }

    console.log('Task file info:', task.file);

    try {
      console.log('Trying API endpoint download...');
      const response = await axios.get(
        `http://localhost:5000/api/task/${task._id}/file`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `${task.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('File downloaded successfully via API');
    } catch (error) {
      console.error('API download failed:', error);

      try {
        console.log('Trying direct file download...');
        const directUrl = `http://localhost:5000/${task.file}`;

        const link = document.createElement('a');
        link.href = directUrl;
        link.setAttribute('download', task.file.split('/').pop() || 'file');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('File downloaded successfully via direct URL');
      } catch (directError) {
        console.error('Direct download also failed:', directError);
        setError('Unable to download file. The file may not exist or the server is not accessible.');
      }
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      alert("No previous page to go back to.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  
  const pagination = {
    total: totalPages,
    current: currentPage
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onFilterChange = (newFilters) => {
    if (newFilters.search !== undefined) setSearchTerm(newFilters.search);
    if (newFilters.status !== undefined) setSelectedStatus(newFilters.status === '' ? 'All' : newFilters.status);
    if (newFilters.priority !== undefined) setSelectedPriority(newFilters.priority === '' ? 'All' : newFilters.priority);
    setCurrentPage(1);
  };

  const filters = {
    search: searchTerm,
    status: selectedStatus === 'All' ? '' : selectedStatus,
    priority: selectedPriority === 'All' ? '' : selectedPriority
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#fafbfc'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading your tasks...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e0e4e7',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Box sx={{ p: 3 }}>
          {/* Top Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handleBack} 
                sx={{ 
                  mr: 2,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                All Tasks
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {user?.name || 'User'}
              </Typography>
            </Box>
          </Box>

          {/* View Tabs */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={0} sx={{ 
              borderBottom: '1px solid #e0e4e7',
              position: 'relative'
            }}>
              {[
                // { key: 'calendar', label: 'Calendar', icon: <CalendarToday sx={{ fontSize: 18 }} /> },
                { key: 'list', label: 'List', icon: <ViewList sx={{ fontSize: 18 }} />, active: viewMode === 'list' },
                { key: 'cards', label: 'Cards', icon: <ViewModule sx={{ fontSize: 18 }} />, active: viewMode === 'cards' },
                // { key: 'kanban', label: 'Kanban', icon: <Assignment sx={{ fontSize: 18 }} /> }
              ].map((tab, index) => (
                <Button
                  key={tab.key}
                  onClick={() => {
                    if (tab.key === 'list') setViewMode('list');
                    if (tab.key === 'cards') setViewMode('cards');
                  }}
                  startIcon={tab.icon}
                  sx={{
                    textTransform: 'none',
                    color: tab.active ? 'primary.main' : 'text.secondary',
                    fontWeight: tab.active ? 600 : 400,
                    px: 3,
                    py: 1.5,
                    borderRadius: 0,
                    borderBottom: tab.active ? '2px solid' : '2px solid transparent',
                    borderColor: tab.active ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: 'grey.50',
                      color: 'primary.main'
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Filters and Controls */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
            {/* Filter Dropdown */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Show</InputLabel>
              <Select
                value={activeFilter}
                label="Show"
                onChange={(e) => setActiveFilter(e.target.value)}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="All Tasks">All Tasks</MenuItem>
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="This Week">This Week</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </FormControl>

            {/* Sort Dropdown */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="deadline">Due Date</MenuItem>
                <MenuItem value="title">Task Name</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ 
                textTransform: 'none',
                borderColor: 'grey.300',
                color: 'text.secondary'
              }}
            >
              Add Filter
            </Button>

            <Box sx={{ flex: 1 }} />

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ 
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white'
                }
              }}
            />
          </Box>

          {/* Advanced Filters */}
          <Collapse in={showFilters}>
            <Paper 
              sx={{ 
                p: 2, 
                mt: 2, 
                bgcolor: '#f8f9fa',
                border: '1px solid #e0e4e7'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={selectedPriority}
                      label="Priority"
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      <MenuItem value="All">All Priority</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, py: 1 }}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Tasks Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        {viewMode === 'cards' ? (
          /* Cards View */
          <Box>
            {filteredTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks found
                </Typography>
                <Typography color="text.secondary">
                  {Object.values(filters).some(val => val) 
                    ? 'Try adjusting your filters' 
                    : 'No tasks have been created yet'
                  }
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {paginatedTasks.map((task, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
                    <Card
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => toggleTaskExpansion(task._id)}
                    >
                      <CardContent sx={{ p: 2, flex: 1 }}>
                        {/* Header with Avatar and Menu */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.main',
                              fontSize: '14px',
                              fontWeight: 600
                            }}
                          >
                            {task.title?.charAt(0).toUpperCase() || 'T'}
                          </Avatar>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClick(e, task);
                            }}
                            sx={{ color: 'text.secondary' }}
                          >
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>

                        {/* Task Title */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                          {task.title}
                        </Typography>

                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 2, minHeight: '40px' }}
                        >
                          {task.description 
                            ? task.description.length > 80 
                              ? task.description.substring(0, 80) + '...'
                              : task.description
                            : 'No description'
                          }
                        </Typography>

                        {/* Status and Priority */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            label={displayStatus(task)}
                            size="small"
                            sx={{
                              fontSize: '11px',
                              fontWeight: 600,
                              height: 22,
                              backgroundColor: 
                                displayStatus(task) === 'Completed' ? '#e8f5e8' :
                                displayStatus(task) === 'Ongoing' ? '#e3f2fd' :
                                displayStatus(task) === 'Pending' ? '#fff3e0' :
                                displayStatus(task) === 'Overdue' ? '#ffebee' : '#f5f5f5',
                              color:
                                displayStatus(task) === 'Completed' ? '#2e7d32' :
                                displayStatus(task) === 'Ongoing' ? '#1976d2' :
                                displayStatus(task) === 'Pending' ? '#f57c00' :
                                displayStatus(task) === 'Overdue' ? '#d32f2f' : '#757575',
                              border: 'none'
                            }}
                          />
                          <Chip
                            label={task.priority || 'Medium'}
                            size="small"
                            sx={{
                              fontSize: '11px',
                              fontWeight: 500,
                              height: 22,
                              backgroundColor: 
                                task.priority === 'High' ? '#ffebee' :
                                task.priority === 'Medium' ? '#fff3e0' :
                                task.priority === 'Low' ? '#e8f5e8' : '#f5f5f5',
                              color:
                                task.priority === 'High' ? '#d32f2f' :
                                task.priority === 'Medium' ? '#f57c00' :
                                task.priority === 'Low' ? '#388e3c' : '#757575',
                              border: 'none'
                            }}
                          />
                        </Box>

                        {/* Progress */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                              {calculateProgress(task)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={calculateProgress(task)}
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              backgroundColor: '#e0e4e7',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                backgroundColor: calculateProgress(task) === 100 ? '#4caf50' : '#1976d2'
                              }
                            }}
                          />
                        </Box>

                        {/* Deadline */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography 
                              variant="caption" 
                              sx={{
                                color: isOverdue(task.deadline) && task.status !== 'Completed' 
                                  ? 'error.main' 
                                  : 'text.secondary',
                                fontWeight: isOverdue(task.deadline) && task.status !== 'Completed' ? 600 : 400
                              }}
                            >
                              {formatDate(task.deadline)}
                            </Typography>
                          </Box>

                          {/* Assigned By */}
                          {task.assignedBy && (
                            <Tooltip title={task.assignedBy.name || task.assignedBy}>
                              <Avatar 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  fontSize: '10px',
                                  bgcolor: 'secondary.main'
                                }}
                              >
                                {(task.assignedBy.name?.charAt(0) || task.assignedBy.charAt(0) || 'A').toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          )}
                        </Box>

                        {/* File attachment indicator */}
                        {task.file && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                            <Chip
                              icon={<AttachFile />}
                              label="File attached"
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '10px' }}
                            />
                          </Box>
                        )}
                      </CardContent>

                      {/* Expandable Details */}
                      <Collapse in={expandedTasks.has(task._id)} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 2, pb: 2 }}>
                          <Divider sx={{ mb: 2 }} />
                          
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Full Description
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {task.description || 'No description provided for this task.'}
                          </Typography>

                          {task.file && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Attachment
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewAttachment({ path: task.file, name: task.file.split('/').pop() });
                                  }}
                                  startIcon={<Visibility />}
                                  sx={{ textTransform: 'none' }}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(task);
                                  }}
                                  startIcon={<Download />}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Download
                                </Button>
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Cards Pagination */}
            {pagination && pagination.total > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4
              }}>
                <Pagination
                  count={pagination.total}
                  page={pagination.current}
                  onChange={(event, page) => handlePageChange(page)}
                  color="primary"
                  size="medium"
                />
              </Box>
            )}
          </Box>
        ) : (
          /* List View with Improved Table Layout */
          <Paper sx={{ overflow: 'hidden', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Table Header with Fixed Layout */}
            <Box sx={{ 
              bgcolor: '#f8f9fa', 
              borderBottom: '1px solid #e0e4e7',
              px: 3,
              py: 2
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: 1.5
              }}>
                <Box sx={{ width: '40px', flexShrink: 0 }}>
                 
                </Box>
                <Box sx={{ width: '30%', flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.5px' }}>
                    TASK NAME
                  </Typography>
                </Box>
                <Box sx={{ width: '12%', flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.5px' }}>
                    START DATE
                  </Typography>
                </Box>
                <Box sx={{ width: '12%', flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.5px' }}>
                    DEADLINE
                  </Typography>
                </Box>
                <Box sx={{ width: '10%', flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.5px' }}>
                    STATUS
                  </Typography>
                </Box>
                <Box sx={{ width: '10%', flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.5px' }}>
                    PEOPLE
                  </Typography>
                </Box>
                <Box sx={{ width: '10%', flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.5px' }}>
                    PRIORITY
                  </Typography>
                </Box>
                <Box sx={{ width: '6%', flexShrink: 0, textAlign: 'center' }}>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Table Body */}
            <Box>
              {filteredTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tasks found
                  </Typography>
                  <Typography color="text.secondary">
                    {Object.values(filters).some(val => val) 
                      ? 'Try adjusting your filters' 
                      : 'No tasks have been created yet'
                    }
                  </Typography>
                </Box>
              ) : (
                <Stack>
                  {paginatedTasks.map((task, index) => (
                    <Box key={task._id}>
                      {/* Main Row with Consistent Layout */}
                      <Box
                        sx={{
                          px: 3,
                          py: 2.5,
                          borderBottom: index !== paginatedTasks.length - 1 ? '1px solid #f1f3f4' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#f8f9fa'
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          gap: 1.5,
                        }}>
                          {/* Checkbox and Expand */}
                          <Box sx={{ width: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                          
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskExpansion(task._id);
                              }}
                              sx={{ 
                                color: 'text.secondary',
                                transform: expandedTasks.has(task._id) ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }}
                            >
                              <ExpandMore sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          {/* Task Name */}
                          <Box sx={{ width: '30%', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2, pr: 2 }}>
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                bgcolor: 'primary.main',
                                fontSize: '14px',
                                fontWeight: 600,
                                flexShrink: 0
                              }}
                            >
                              {task.title?.charAt(0).toUpperCase() || 'T'}
                            </Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, wordBreak: 'break-word' }}>
                                {task.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {task.description ? task.description.substring(0, 50) + '...' : 'No description'}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Start Date */}
                          <Box sx={{ width: '12%', flexShrink: 0, pr: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(task.assignedDate)}
                            </Typography>
                          </Box>

                          {/* Deadline */}
                          <Box sx={{ width: '12%', flexShrink: 0, pr: 2 }}>
                            <Typography 
                              variant="body2" 
                              sx={{
                                color: isOverdue(task.deadline) && task.status !== 'Completed' 
                                  ? 'error.main' 
                                  : 'text.primary',
                                fontWeight: isOverdue(task.deadline) && task.status !== 'Completed' ? 600 : 400
                              }}
                            >
                              {formatDate(task.deadline)}
                            </Typography>
                          </Box>

                          {/* Status */}
                          <Box sx={{ width: '10%', flexShrink: 0, pr: 2 }}>
                            <Chip
                              label={displayStatus(task)}
                              size="small"
                              sx={{
                                fontSize: '11px',
                                fontWeight: 600,
                                height: 24,
                                backgroundColor: 
                                  displayStatus(task) === 'Completed' ? '#e8f5e8' :
                                  displayStatus(task) === 'Ongoing' ? '#e3f2fd' :
                                  displayStatus(task) === 'Pending' ? '#fff3e0' :
                                  displayStatus(task) === 'Overdue' ? '#ffebee' : '#f5f5f5',
                                color:
                                  displayStatus(task) === 'Completed' ? '#2e7d32' :
                                  displayStatus(task) === 'Ongoing' ? '#1976d2' :
                                  displayStatus(task) === 'Pending' ? '#f57c00' :
                                  displayStatus(task) === 'Overdue' ? '#d32f2f' : '#757575',
                                border: 'none'
                              }}
                            />
                          </Box>

                          {/* People */}
                          <Box sx={{ width: '10%', flexShrink: 0, pr: 2 }}>
                            {task.assignedBy ? (
                              <Tooltip title={task.assignedBy.name || task.assignedBy}>
                                <Avatar 
                                  sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    fontSize: '12px',
                                    bgcolor: 'secondary.main'
                                  }}
                                >
                                  {(task.assignedBy.name?.charAt(0) || task.assignedBy.charAt(0) || 'A').toUpperCase()}
                                </Avatar>
                              </Tooltip>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                No assignee
                              </Typography>
                            )}
                          </Box>

                          {/* Priority */}
                          <Box sx={{ width: '10%', flexShrink: 0, pr: 2 }}>
                            <Chip
                              label={task.priority || 'Medium'}
                              size="small"
                              sx={{
                                fontSize: '11px',
                                fontWeight: 500,
                                height: 24,
                                backgroundColor: 
                                  task.priority === 'High' ? '#ffebee' :
                                  task.priority === 'Medium' ? '#fff3e0' :
                                  task.priority === 'Low' ? '#e8f5e8' : '#f5f5f5',
                                color:
                                  task.priority === 'High' ? '#d32f2f' :
                                  task.priority === 'Medium' ? '#f57c00' :
                                  task.priority === 'Low' ? '#388e3c' : '#757575',
                                border: 'none'
                              }}
                            />
                          </Box>

                          {/* Actions */}
                          <Box sx={{ width: '6%', flexShrink: 0, textAlign: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e, task);
                              }}
                              sx={{ color: 'text.secondary' }}
                            >
                              <MoreVert sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      {/* Expandable Details */}
                      <Collapse in={expandedTasks.has(task._id)} timeout="auto" unmountOnExit>
                        <Box sx={{ 
                          bgcolor: '#f8f9fa', 
                          p: 3, 
                          borderBottom: '1px solid #e0e4e7',
                        }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                            Task Details
                          </Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Description
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    p: 2, 
                                    bgcolor: 'white', 
                                    borderRadius: 1,
                                    border: '1px solid #e0e4e7',
                                    fontStyle: task.description ? 'normal' : 'italic'
                                  }}
                                >
                                  {task.description || 'No description provided for this task.'}
                                </Typography>
                              </Box>

                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Progress
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={calculateProgress(task)}
                                    sx={{ 
                                      flex: 1,
                                      height: 8, 
                                      borderRadius: 4,
                                      backgroundColor: '#e0e4e7',
                                      '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        backgroundColor: calculateProgress(task) === 100 ? '#4caf50' : '#1976d2'
                                      }
                                    }}
                                  />
                                  <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 40 }}>
                                    {calculateProgress(task)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              {task.file && (
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Attachments
                                  </Typography>
                                  <Paper 
                                    sx={{ 
                                      p: 2, 
                                      bgcolor: 'white',
                                      border: '1px solid #e0e4e7',
                                      borderRadius: 1
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                      <AttachFile sx={{ color: 'primary.main', fontSize: 20 }} />
                                      <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                                          {task.file.split('/').pop()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Attachment
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1}>
                                      <Button 
                                        size="small" 
                                        variant="outlined" 
                                        onClick={() => viewAttachment({ path: task.file, name: task.file.split('/').pop() })}
                                        startIcon={<Visibility />}
                                        sx={{ textTransform: 'none' }}
                                      >
                                        View
                                      </Button>
                                      <Button 
                                        size="small" 
                                        variant="contained" 
                                        onClick={() => downloadFile(task)}
                                        startIcon={<Download />}
                                        sx={{ textTransform: 'none' }}
                                      >
                                        Download
                                      </Button>
                                    </Stack>
                                  </Paper>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            {/* List Pagination */}
            {pagination && pagination.total > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                p: 2,
                borderTop: '1px solid #f1f3f4',
                bgcolor: '#fafbfc'
              }}>
                <Pagination
                  count={pagination.total}
                  page={pagination.current}
                  onChange={(event, page) => handlePageChange(page)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon(newStatus)}
            Update Task Status
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Update status for task: <strong>{selectedTask?.title}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="Pending">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="warning" />
                  Pending
                </Box>
              </MenuItem>
              <MenuItem value="Ongoing">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayArrow color="info" />
                  Ongoing
                </Box>
              </MenuItem>
              <MenuItem value="Completed">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  Completed
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={updatingStatus}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusSubmit} 
            variant="contained"
            disabled={updatingStatus || !newStatus}
            startIcon={updatingStatus ? <CircularProgress size={16} /> : null}
          >
            {updatingStatus ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleStatusUpdate}>
          <Edit sx={{ mr: 1 }} /> Update Status
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); updateTaskStatus(selectedTask._id, 'Completed'); }}>
          <CheckCircle sx={{ mr: 1 }} /> Mark Complete
        </MenuItem>
      </Menu>
    </Box>
  );
}