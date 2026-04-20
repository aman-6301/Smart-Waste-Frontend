import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, Stack, 
  CircularProgress, Paper, Divider, Alert, IconButton, Tooltip, Grid, Chip
} from '@mui/material';
import { 
  CheckCircle, DeleteOutline, Refresh, Navigation, 
  LocationOn, LocalShipping, QueryStats, History
} from '@mui/icons-material';
import api from '../services/api';

const DriverDashboard = () => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collectingId, setCollectingId] = useState(null);
  const [completedLabels, setCompletedLabels] = useState([]);

  const truckId = 1;

  useEffect(() => {
    fetchActiveRoute();
  }, []);

  // --- UPDATED LOGIC FOR PERMANENT FIX ---
  const fetchActiveRoute = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/driver/routes/${truckId}`);
      if (res.data && res.data.length > 0) {
        const latest = res.data[res.data.length - 1];
        
        // Only show the route if the backend says it is still "ASSIGNED"
        if (latest.status === "ASSIGNED") {
          setRoute(latest);
        } else {
          setRoute(null); // Shows "Route Completed" UI
        }
      } else {
        setRoute(null);
      }
    } catch (err) {
      console.error("Error fetching route:", err);
      setRoute(null);
    } finally {
      setLoading(false);
    }
  };
  // ---------------------------------------

  const handleEmptyBin = async (label, dbId) => {
    setCollectingId(dbId);
    try {
      await api.put(`/driver/collect/${dbId}`);
      setCompletedLabels(prev => [...prev, label]);
      
      // OPTIONAL: Refresh route status after every collection to see if backend closed it
      // fetchActiveRoute(); 
    } catch (err) {
      alert(`Error updating ${label}`);
    } finally {
      setCollectingId(null);
    }
  };

  const openInGoogleMaps = (coords) => {
    if (!coords) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${coords}`, '_blank');
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f7fe">
      <CircularProgress thickness={5} size={60} sx={{ color: '#1a73e8' }} />
    </Box>
  );

  const labels = route?.orderedBinIds ? route.orderedBinIds.split(' -> ') : [];
  const ids = route?.orderedNumericIds ? route.orderedNumericIds.split(' -> ') : [];
  const coords = route?.orderedCoordinates ? route.orderedCoordinates.split(' -> ') : [];

  const activeStops = labels
    .map((label, index) => ({ label, dbId: ids[index], gps: coords[index] }))
    .filter(stop => !completedLabels.includes(stop.label));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      
      {/* 1. PROFESSIONAL TOP BAR */}
      <Paper elevation={0} sx={{ p: 2, px: 4, borderRadius: 0, bgcolor: '#ffffff', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, bgcolor: '#1a73e8', borderRadius: 2 }}>
            <LocalShipping sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ color: '#1b2559' }}>SMART WASTE PRO</Typography>
            <Typography variant="caption" color="textSecondary">Driver Terminal • System Live</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center">
          <Chip icon={<QueryStats />} label={`Progress: ${completedLabels.length}/${labels.length}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
          <IconButton onClick={fetchActiveRoute} sx={{ bgcolor: '#f4f7fe' }}><Refresh /></IconButton>
        </Stack>
      </Paper>

      {/* 2. MAIN CONTENT AREA */}
      <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: Active Tasks */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#1b2559' }}>Active Route Optimization</Typography>
            
            {(!route || activeStops.length === 0) ? (
              <Card sx={{ p: 8, textAlign: 'center', borderRadius: 5, boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)' }}>
                <CheckCircle sx={{ fontSize: 100, color: '#01b574', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">Route Completed</Typography>
                <Typography color="textSecondary">No active assignments. All bins have been cleared.</Typography>
                <Button variant="contained" sx={{ mt: 3, borderRadius: 2 }} onClick={fetchActiveRoute}>Check for New Route</Button>
              </Card>
            ) : (
              <Stack spacing={2}>
                {activeStops.map((stop, index) => {
                  const isCurrent = index === 0;
                  return (
                    <Card key={stop.label} sx={{ 
                      p: 1, borderRadius: 4, transition: '0.4s',
                      boxShadow: isCurrent ? '0 10px 30px rgba(26, 115, 232, 0.15)' : 'none',
                      border: isCurrent ? '2px solid #1a73e8' : '1px solid #e0e0e0',
                      bgcolor: isCurrent ? '#ffffff' : '#fafcfe'
                    }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '16px !important' }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Box sx={{ 
                            width: 50, height: 50, borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center',
                            bgcolor: isCurrent ? '#1a73e8' : '#e2e8f0', color: isCurrent ? 'white' : '#64748b', fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" color="#1b2559">{stop.label}</Typography>
                            <Typography variant="body2" color="textSecondary">GPS: {stop.gps || 'Pending...'}</Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Button 
                            startIcon={<Navigation />} 
                            onClick={() => openInGoogleMaps(stop.gps)}
                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
                          >
                            Map
                          </Button>
                          <Button 
                            variant="contained" 
                            disabled={collectingId === stop.dbId}
                            onClick={() => handleEmptyBin(stop.label, stop.dbId)}
                            sx={{ 
                              borderRadius: 3, textTransform: 'none', px: 4, fontWeight: 'bold',
                              bgcolor: isCurrent ? '#1a73e8' : '#64748b',
                              '&:hover': { bgcolor: '#1557b0' }
                            }}
                          >
                            {collectingId === stop.dbId ? <CircularProgress size={20} color="inherit" /> : 'Confirm Collection'}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Grid>

          {/* RIGHT COLUMN: Stats & History */}
          <Grid item xs={12} lg={4}>
             <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#1b2559' }}>Work Log</Typography>
             
             <Paper sx={{ p: 3, borderRadius: 5, mb: 4, boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)' }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <History color="primary" />
                  <Typography variant="h6" fontWeight="bold">Completed Stops</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                
                {completedLabels.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                    No collections logged for this shift yet.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {completedLabels.map((label) => (
                      <Box key={label} sx={{ display: 'flex', alignItems: 'center', p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                        <CheckCircle sx={{ color: '#01b574', fontSize: 18, mr: 2 }} />
                        <Typography variant="body2" fontWeight="600" color="#1b2559">{label}</Typography>
                        <Typography variant="caption" sx={{ ml: 'auto', color: '#01b574' }}>Verified</Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
             </Paper>

             <Card sx={{ p: 3, borderRadius: 5, bgcolor: '#1b2559', color: 'white' }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>ESTIMATED TRAVEL DISTANCE</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>{route?.estimatedDistance || 0} km</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Optimized using Nearest Neighbor Algorithm</Typography>
             </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DriverDashboard;