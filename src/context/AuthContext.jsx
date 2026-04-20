import React, { createContext, useState, useEffect, useContext } from 'react'; // Added useContext
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          // Note: added username from decoded token if available
          setUser({ token, role: decoded.role, username: decoded.sub || 'User' });
        }
      } catch (error) {
        console.error("Invalid token found");
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;
      const username = decoded.sub || 'User';

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      setUser({ token, role, username });

      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/driver');
      }
    } catch (error) {
      console.error("Error decoding token during login:", error);
      alert("Login failed: Invalid token structure.");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// This helper hook now has access to useContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};