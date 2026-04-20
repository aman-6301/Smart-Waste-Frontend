import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress, 
  Card, CardContent, Stack, Button, Tabs, Tab, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, Avatar, Divider
} from '@mui/material';
import { 
  Add, Route, LocalShipping, Delete, Warning, BarChart, 
  Refresh, Settings, Dashboard, DeleteSweep, LocationOn 
} from '@mui/icons-material';
import api from '../services/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0); 
  const [bins, setBins] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [stats, setStats] = useState({ todayCollections: 0, totalCollections: 0 });
  const [loading, setLoading] = useState(true);
  
  const [openBinModal, setOpenBinModal] = useState(false);
  const [openTruckModal, setOpenTruckModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const [newBin, setNewBin] = useState({ binId: '', latitude: '', longitude: '', capacity: 100 });
  const [newTruck, setNewTruck] = useState({ truckNumber: '', capacity: 500, driverId: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [binsRes, statsRes, trucksRes] = await Promise.all([
        api.get('/admin/bins'),
        api.get('/admin/analytics/daily'),
        api.get('/admin/trucks')
      ]);
      setBins(binsRes.data);
      setStats(statsRes.data);
      setTrucks(trucksRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBin = async () => {
    try {
      await api.post('/admin/bins', { ...newBin, currentFill: 0, status: 'NORMAL' });
      setOpenBinModal(false);
      loadAllData();
    } catch (err) { alert("Error adding bin."); }
  };

  const handleAddTruck = async () => {
    try {
      await api.post('/admin/trucks', { ...newTruck, currentLoad: 0 });
      setOpenTruckModal(false);
      loadAllData();
    } catch (err) { alert("Error adding truck."); }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      await api.post('/admin/routes/optimize');
      alert("Route optimization complete! Driver routes have been updated.");
      loadAllData();
    } catch (err) { alert("Optimization failed."); }
    finally { setOptimizing(false); }
  };

  return (
    <Box sx={{ bgcolor: '#f4f7fe', minHeight: '100vh', pb: 10 }}>
      
      {/* 1. PROFESSIONAL TOP BAR (Same as Driver UI) */}
      <Paper elevation={0} sx={{ p: 2, px: 4, borderRadius: 0, bgcolor: '#ffffff', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, bgcolor: '#1b2559', borderRadius: 2 }}>
            <Settings sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ color: '#1b2559' }}>COMMAND CENTER</Typography>
            <Typography variant="caption" color="textSecondary">System Administrator • Management Portal</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Tooltip title="Reload System Data">
            <IconButton onClick={loadAllData} sx={{ bgcolor: '#f4f7fe' }}><Refresh /></IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            startIcon={optimizing ? <CircularProgress size={20} color="inherit" /> : <Route />} 
            onClick={handleOptimize}
            disabled={optimizing}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', bgcolor: '#1a73e8', px: 3 }}
          >
            {optimizing ? "Calculating..." : "Optimize Routes"}
          </Button>
        </Stack>
      </Paper>

      <Container maxWidth="xl">
        {/* 2. ANALYTICS CARDS (Uniform Styling) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 5, boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="overline" fontWeight="bold">Today's Collections</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#1b2559' }}>{stats.todayCollections}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981', width: 56, height: 56 }}>
                    <BarChart />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 5, boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="overline" fontWeight="bold">Overflow Alerts</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#e11d48' }}>
                      {bins.filter(b => b.status === 'NEEDS_PICKUP').length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#fff1f2', color: '#e11d48', width: 56, height: 56 }}>
                    <Warning />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 5, bgcolor: '#1b2559', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ opacity: 0.8 }} variant="overline" fontWeight="bold">Active Fleet</Typography>
                    <Typography variant="h4" fontWeight="bold">{trucks.length} Trucks</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 56, height: 56 }}>
                    <LocalShipping />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 3. TABS & TABLES (Uniform Styling) */}
        <Paper sx={{ borderRadius: 5, overflow: 'hidden', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', border: 'none' }}>
          <Tabs 
            value={tab} 
            onChange={(e, v) => setTab(v)} 
            sx={{ 
              px: 3, pt: 2, bgcolor: 'white',
              '& .MuiTab-root': { fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }
            }}
          >
            <Tab label="Smart Bin Registry" />
            <Tab label="Fleet Management" />
          </Tabs>
          <Divider />

          {loading ? <LinearProgress /> : (
            <Box>
              {tab === 0 ? (
                <Box>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f4f7fe' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>BIN ID</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>LOCATION</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>FILL LEVEL</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>STATUS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bins.map((bin) => (
                          <TableRow key={bin.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell><Typography fontWeight="bold" color="#1b2559">{bin.binId}</Typography></TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOn sx={{ fontSize: 16, color: '#1a73e8' }} />
                                <Typography variant="body2" color="textSecondary">{bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell width="30%">
                              <Stack direction="row" spacing={2} alignItems="center">
                                <LinearProgress 
                                  variant="determinate" 
                                  value={bin.currentFill} 
                                  sx={{ flexGrow: 1, height: 8, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { borderRadius: 5 } }} 
                                  color={bin.currentFill > 80 ? "error" : "primary"} 
                                />
                                <Typography variant="caption" fontWeight="bold">{bin.currentFill}%</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={bin.status} 
                                size="small" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  bgcolor: bin.status === 'NEEDS_PICKUP' ? '#fff1f2' : '#f0fdf4',
                                  color: bin.status === 'NEEDS_PICKUP' ? '#e11d48' : '#10b981'
                                }} 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" startIcon={<Add />} onClick={() => setOpenBinModal(true)} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}>
                      Register New Bin
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f4f7fe' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>TRUCK NO</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>MAX CAPACITY</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>CURRENT LOAD</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#a0aec0' }}>DRIVER</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trucks.map((truck) => (
                          <TableRow key={truck.id} hover>
                            <TableCell><Typography fontWeight="bold" color="#1b2559">{truck.truckNumber}</Typography></TableCell>
                            <TableCell>{truck.capacity} kg</TableCell>
                            <TableCell>
                              <Chip label={`${truck.currentLoad} kg`} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{truck.driverId}</Avatar>
                                <Typography variant="body2">Driver {truck.driverId}</Typography>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" startIcon={<LocalShipping />} onClick={() => setOpenTruckModal(true)} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}>
                      Add Fleet Vehicle
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      {/* 4. DIALOGS (Uniform Styling) */}
      <Dialog open={openBinModal} onClose={() => setOpenBinModal(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1b2559' }}>Install New Smart Bin</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Bin Label (e.g., BIN-001)" fullWidth variant="filled" onChange={(e) => setNewBin({...newBin, binId: e.target.value})} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Lat" type="number" fullWidth variant="filled" onChange={(e) => setNewBin({...newBin, latitude: e.target.value})} /></Grid>
              <Grid item xs={6}><TextField label="Lng" type="number" fullWidth variant="filled" onChange={(e) => setNewBin({...newBin, longitude: e.target.value})} /></Grid>
            </Grid>
            <TextField label="Max Capacity (Litres)" type="number" fullWidth variant="filled" defaultValue={100} onChange={(e) => setNewBin({...newBin, capacity: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenBinModal(false)} sx={{ color: '#718096' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBin} sx={{ borderRadius: 3, px: 4, bgcolor: '#1b2559' }}>Register</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTruckModal} onClose={() => setOpenTruckModal(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1b2559' }}>Register Fleet Vehicle</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Plate Number" fullWidth variant="filled" onChange={(e) => setNewTruck({...newTruck, truckNumber: e.target.value})} />
            <TextField label="Payload Capacity (kg)" type="number" fullWidth variant="filled" onChange={(e) => setNewTruck({...newTruck, capacity: e.target.value})} />
            <TextField label="Assigned Driver ID" type="number" fullWidth variant="filled" onChange={(e) => setNewTruck({...newTruck, driverId: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenTruckModal(false)} sx={{ color: '#718096' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTruck} sx={{ borderRadius: 3, px: 4, bgcolor: '#1b2559' }}>Add Truck</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;