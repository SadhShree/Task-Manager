import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExitToApp as LogoutIcon,
  PushPin as PinIcon,
  Sort as SortIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentSort, setCurrentSort] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      showSnackbar('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      showSnackbar('Task title is required', 'error');
      return;
    }
    try {
      await createTask({ ...newTask, pinned: false });
      setNewTask({ title: '', description: '' });
      showSnackbar('Task created successfully');
      loadTasks();
    } catch (error) {
      showSnackbar('Error creating task', 'error');
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editTask?.title?.trim()) {
      showSnackbar('Task title is required', 'error');
      return;
    }
    try {
      await updateTask(editTask._id, editTask);
      setEditDialogOpen(false);
      showSnackbar('Task updated successfully');
      loadTasks();
    } catch (error) {
      showSnackbar('Error updating task', 'error');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { ...task, status: !task.status });
      showSnackbar(`Task marked as ${!task.status ? 'complete' : 'incomplete'}`);
      loadTasks();
    } catch (error) {
      showSnackbar('Error updating task status', 'error');
    }
  };

  const handleTogglePin = async (task) => {
    try {
      await updateTask(task._id, { ...task, pinned: !task.pinned });
      showSnackbar(`Task ${!task.pinned ? 'pinned' : 'unpinned'}`);
      loadTasks();
    } catch (error) {
      showSnackbar('Error updating task pin status', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      showSnackbar('Task deleted successfully');
      loadTasks();
    } catch (error) {
      showSnackbar('Error deleting task', 'error');
    }
  };

  const handleSort = (type) => {
    setSortAnchorEl(null);
    setCurrentSort(type);
    const sortedTasks = [...tasks];
    
    // First separate pinned and unpinned tasks
    const pinnedTasks = sortedTasks.filter(task => task.pinned);
    const unpinnedTasks = sortedTasks.filter(task => !task.pinned);
    
    // Sort each group separately
    const sortFunction = (a, b) => {
      switch (type) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status === b.status ? 0 : a.status ? -1 : 1;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    };

    // Sort both groups
    pinnedTasks.sort(sortFunction);
    unpinnedTasks.sort(sortFunction);

    // Combine the sorted groups
    setTasks([...pinnedTasks, ...unpinnedTasks]);
    showSnackbar(`Sorted by ${type}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ 
        bgcolor: '#667eea',
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Task Manager
          </Typography>
          <IconButton
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
            color="inherit"
          >
            <SortIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => { logout(); navigate('/login'); }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        <MenuItem 
          onClick={() => handleSort('title')}
          sx={{ 
            backgroundColor: currentSort === 'title' ? '#f0f0f0' : 'transparent',
            fontWeight: currentSort === 'title' ? 'bold' : 'normal'
          }}
        >
          Sort by Title
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort('status')}
          sx={{ 
            backgroundColor: currentSort === 'status' ? '#f0f0f0' : 'transparent',
            fontWeight: currentSort === 'status' ? 'bold' : 'normal'
          }}
        >
          Sort by Status
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort('date')}
          sx={{ 
            backgroundColor: currentSort === 'date' ? '#f0f0f0' : 'transparent',
            fontWeight: currentSort === 'date' ? 'bold' : 'normal'
          }}
        >
          Sort by Date
        </MenuItem>
      </Menu>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleCreateTask}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    error={!newTask.title.trim()}
                    helperText={!newTask.title.trim() ? 'Title is required' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    multiline
                    rows={1}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    }}
                  >
                    Add Task
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Card sx={{
                  position: 'relative',
                  borderRadius: 2,
                  boxShadow: task.pinned ? '0 4px 12px rgba(102, 126, 234, 0.25)' : '0 2px 4px rgba(0,0,0,0.1)',
                  border: task.pinned ? '2px solid #667eea' : 'none',
                  backgroundColor: task.pinned ? '#f8faff' : 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}>
                  {task.pinned && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#667eea',
                        color: 'white',
                        padding: '4px 8px',
                        borderBottomLeftRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Pinned
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconButton onClick={() => handleToggleComplete(task)}>
                        {task.status ? <CheckCircleIcon color="success" /> : <UncheckedIcon />}
                      </IconButton>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          flexGrow: 1,
                          textDecoration: task.status ? 'line-through' : 'none',
                          color: task.status ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {task.title}
                      </Typography>
                      <IconButton 
    onClick={() => handleTogglePin(task)} 
    color={task.pinned ? "primary" : "default"}
    title={task.pinned ? "Unpin task" : "Pin task"}
  >
    <PinIcon sx={{
      transform: task.pinned ? 'none' : 'rotate(45deg)',
      transition: 'transform 0.2s ease'
    }} />
  </IconButton>
                      <IconButton onClick={() => handleEditClick(task)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" sx={{ pl: 6 }}>
                      {task.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editTask?.title || ''}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            required
            error={editTask?.title === ''}
            helperText={editTask?.title === '' ? 'Title is required' : ''}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={editTask?.description || ''}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;