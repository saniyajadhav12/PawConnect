import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import api from '../config/api';
import { clearSession, getUserId } from '../config/auth';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = getUserId();


  // Fetch the logged-in user's profile on component mount
  useEffect(() => {
    api.get('/user/profile')
      .then(response => {
        const { name, email, address } = response.data;
        setUser({ name, email, address: address ?? '' });
      })
      .catch(() => {
        setError('Error fetching user data');
      });
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Validate inputs
  const validateInputs = () => {
    if (!user.name || !user.email || !user.address) {
      setError('All fields are required.');
      return false;
    }
    setError(null); // Clear previous error if inputs are valid
    return true;
  };

  // Handle form submission for updating user details
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    api.put(`/user/${userId}`, {
      name: user.name,
      email: user.email,
      address: user.address,
    })
      .then(() => {
        setIsLoading(false);
        alert('Profile updated successfully!');
      })
      .catch(() => {
        setIsLoading(false);
        setError('Error updating profile');
      });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      api.delete(`/user/${userId}`)
        .then(() => {
          setIsLoading(false);
          alert('Account deleted successfully!');
          // The account is gone, so end the session and go to login
          clearSession();
          navigate('/login');
        })
        .catch(() => {
          setIsLoading(false);
          setError('Error deleting account');
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>Update Profile</Typography>

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Adds native browser validation
            error={!user.name && error !== null}
            helperText={!user.name && error ? "Name is required" : ""}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Adds native browser validation
            error={!user.email && error !== null}
            helperText={!user.email && error ? "Email is required" : ""}
          />
          <TextField
            label="Address"
            name="address"
            value={user.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Adds native browser validation
            error={!user.address && error !== null}
            helperText={!user.address && error ? "Address is required" : ""}
          />
          
          <Box sx={{ marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>
        </form>

        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteAccount}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
