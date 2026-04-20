import React, { useState } from 'react';
import { 
  Container, Box, Paper, Typography, TextField, Button, 
  Stack, InputAdornment, IconButton, Alert, Divider 
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, LocalShipping, Shield } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token); 
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
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
      backgroundSize: '40px 40px' 
    }}>
      {/* IDEA 3: MISSION STATEMENT HEADER */}
      <Box sx={{ textAlign: 'center', mb: 4, px: 2 }}>
        <Typography 
          variant="h3" 
          fontWeight="900" 
          sx={{ color: '#1b2559', letterSpacing: '-1.5px', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}
        >
          Efficiency starts here.
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: '400', maxWidth: '500px', mx: 'auto' }}>
          Log in to access your real-time waste management console and optimize city logistics.
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <Box sx={{ p: 1.5, bgcolor: '#1b2559', borderRadius: 3, mb: 1 }}>
              <Shield sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="800" color="#1b2559">Secure Access</Typography>
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                fullWidth
                variant="outlined"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ bgcolor: '#1b2559', py: 2, borderRadius: 3, fontWeight: 'bold', textTransform: 'none', fontSize: '1.1rem' }}
              >
                {loading ? "Verifying..." : "Enter Command Center"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;