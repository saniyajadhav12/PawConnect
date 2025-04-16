import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Box, Button, TextField, Typography, Container } from '@mui/material'; // Importing Material UI components
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/user/login', formData);
      setMessage('Login Successful');
      navigate('/homepage');  // Navigate to the home page after successful login
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Server error. Please try again later.');
      }
    }
  };

  return (
    <>
      <Header />
      <Box 
        className="login-page" // Apply the background image to the Box component
        sx={{width: "330%", height: "100vh",
          backgroundImage: 'url(../src/images/login_page_1.jpg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}
      >
        <Container component="main" maxWidth="xs"> 
          {/* Container for the form */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: 2,
              padding: 4,
              boxShadow: 4, 
            }}
          >
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>Sign-in / Login</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
              >
                Login
              </Button>
              <Typography variant="body2" color="textSecondary" align="center">
                {message}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                Don't have an account? <a href="/signup">Sign-up</a>
              </Typography>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
