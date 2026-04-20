import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box, Container, Avatar } from '@mui/material';
import { LocalShipping, Dashboard, Route, ExitToApp } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar completely on Login and Register pages
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        bgcolor: '#ffffff', 
        borderBottom: '1px solid #e0e0e0',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
          
          {/* LOGO */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ 
              p: 1, 
              bgcolor: user?.role === 'ADMIN' ? '#1b2559' : '#1a73e8', 
              borderRadius: 2, 
              display: 'flex' 
            }}>
              <LocalShipping sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" fontWeight="800" sx={{ color: '#1b2559', letterSpacing: '-0.5px' }}>
              SMART WASTE {user?.role || 'PRO'}
            </Typography>
          </Stack>

          {/* NAV LINKS */}
          <Stack direction="row" spacing={1} alignItems="center">
            {user?.role === 'ADMIN' && (
              <Button startIcon={<Dashboard />} onClick={() => navigate('/admin')} sx={{ color: '#1b2559', fontWeight: 'bold' }}>
                Admin Panel
              </Button>
            )}

            {user?.role === 'DRIVER' && (
              <Button startIcon={<Route />} onClick={() => navigate('/driver')} sx={{ color: '#1a73e8', fontWeight: 'bold' }}>
                My Route
              </Button>
            )}

            {user ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 2 }}>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight="bold" color="#1b2559">{user.username}</Typography>
                  <Typography variant="caption" color="textSecondary">{user.role}</Typography>
                </Box>
                <Button 
                  onClick={logout}
                  variant="contained" 
                  color="error" 
                  size="small"
                  startIcon={<ExitToApp />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Logout
                </Button>
              </Stack>
            ) : (
              <Button variant="outlined" onClick={() => navigate('/login')} sx={{ borderRadius: 2 }}>
                Login
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;