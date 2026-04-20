import React, { useState } from 'react';
import { 
  Container, Box, Paper, Typography, TextField, Button, 
  Stack, MenuItem, Alert, InputAdornment, Divider 
} from '@mui/material';
import { LocalShipping, PersonAdd, Email, Lock, Badge } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'DRIVER' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f4f7fe',
      backgroundImage: `radial-gradient(#d1dcf0 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      py: 5
    }}>
      
      {/* IDEA 3: MISSION STATEMENT HEADER */}
      <Box sx={{ textAlign: 'center', mb: 4, px: 2 }}>
        <Typography 
          variant="h3" 
          fontWeight="900" 
          sx={{ color: '#1a73e8', letterSpacing: '-1.5px', mb: 1, fontSize: { xs: '2.2rem', md: '3.5rem' } }}
        >
          Build a greener tomorrow.
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: '400', maxWidth: '600px', mx: 'auto', lineHeight: 1.4 }}>
          Join our global network of smart drivers and administrators to reduce carbon footprint through optimized collection.
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 6, 
            boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', 
            border: '1px solid #e2e8f0',
            bgcolor: 'white'
          }}
        >
          <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <Box sx={{ p: 1.5, bgcolor: '#1a73e8', borderRadius: 3, mb: 1 }}>
              <PersonAdd sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="800" color="#1b2559">Create Account</Typography>
            <Typography variant="body2" color="textSecondary">Fill in the details to join the fleet</Typography>
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Badge color="action" /></InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
              />

              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
              />

              <TextField
                select
                label="I am a..."
                value={formData.role}
                fullWidth
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
              >
                <MenuItem value="DRIVER">Driver (Route Collector)</MenuItem>
                <MenuItem value="ADMIN">System Administrator</MenuItem>
              </TextField>

              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ 
                  bgcolor: '#1a73e8', 
                  py: 2, 
                  mt: 2,
                  borderRadius: 3, 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                  '&:hover': { bgcolor: '#155db1', boxShadow: 'none' }
                }}
              >
                {loading ? "Creating Account..." : "Join the Fleet"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 4 }}>
            <Typography variant="caption" color="textSecondary">ALREADY A MEMBER?</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account? {' '}
              <Link to="/login" style={{ color: '#1b2559', fontWeight: 'bold', textDecoration: 'none' }}>
                Log in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;