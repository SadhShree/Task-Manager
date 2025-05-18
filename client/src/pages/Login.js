import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isRegistering) {
        response = await register(email, password);
      } else {
        response = await login(email, password);
      }
      authLogin(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert(isRegistering ? 'Registration failed' : 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              {isRegistering ? 'Register' : 'Login'} - Task Manager
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  {isRegistering ? 'Register' : 'Sign In'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? 'Back to Login' : 'Need an account? Register'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;