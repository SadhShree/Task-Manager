import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  
} from '@mui/icons-material';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '' });
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { ...task, status: !task.status });
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Manager
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleCreateTask}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ height: '100%' }}
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {task.title}
                </Typography>
                <Typography color="text.secondary">
                  {task.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    onClick={() => handleToggleComplete(task)}
                    variant={task.status ? "contained" : "outlined"}
                  >
                    {task.status ? "Completed" : "Mark Complete"}
                  </Button>
                  <IconButton onClick={() => handleDeleteTask(task._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;