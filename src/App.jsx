import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import { Box, Toolbar } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        {/* The Toolbar here acts as a "spacer" because the Navbar is fixed */}
        <Toolbar /> 

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Protected Driver Routes */}
            <Route element={<ProtectedRoute allowedRole="DRIVER" />}>
              <Route path="/driver" element={<DriverDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;