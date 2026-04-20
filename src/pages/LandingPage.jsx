import React from 'react';
import { 
  Box, Button, Container, Typography, Grid, Card, Stack, 
  Avatar, useTheme, useMediaQuery, IconButton, Divider, alpha 
} from '@mui/material';
import { 
  LocalShipping, Analytics, LocationOn, Speed,
  LinkedIn, Twitter, GitHub, ArrowForward, CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    { title: "IoT Bin Sensors", desc: "Real-time ultrasonic fill-level detection with 99% accuracy.", icon: <LocationOn />, color: '#10b981' },
    { title: "Dynamic Routing", desc: "AI-calculated paths reduce fuel consumption by up to 30%.", icon: <LocalShipping />, color: '#3b82f6' },
    { title: "Predictive Analytics", desc: "Forecast waste trends using seasonal historical data.", icon: <Analytics />, color: '#8b5cf6' },
    { title: "Instant Alerts", desc: "Push notifications for bin overflows and vehicle maintenance.", icon: <Speed />, color: '#ef4444' },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', overflow: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
      <Box sx={{ 
        position: 'relative', 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center',
        background: `linear-gradient(135deg, ${alpha('#f4f7fe', 0.9)} 0%, #ffffff 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: alpha('#1a73e8', 0.05),
          filter: 'blur(80px)',
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <Chip label="v2.0 LIVE" color="primary" size="small" sx={{ fontWeight: 900, borderRadius: '6px' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    TRUSTED BY 50+ MUNICIPALITIES
                  </Typography>
                </Stack>
                
                <Typography variant="h1" sx={{ 
                  fontWeight: 900, 
                  fontSize: isMobile ? '2.8rem' : '4.5rem', 
                  lineHeight: 1, 
                  mb: 3, 
                  color: '#1b2559',
                  letterSpacing: '-2px'
                }}>
                  Clean Cities. <br />
                  <span style={{ color: '#1a73e8' }}>Smarter Logistics.</span>
                </Typography>
                
                <Typography variant="h6" sx={{ color: '#64748b', mb: 5, fontWeight: 400, lineHeight: 1.6, maxWidth: '550px' }}>
                  The industry-leading cloud platform for waste management. Optimize routes, monitor bin levels in real-time, and reduce operational costs.
                </Typography>

                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/login')} 
                    sx={{ 
                      px: 4, py: 2, borderRadius: '12px', bgcolor: '#1b2559', 
                      textTransform: 'none', fontSize: '1.1rem', fontWeight: 700,
                      boxShadow: '0 10px 20px rgba(27, 37, 89, 0.2)'
                    }}
                  >
                    Admin Dashboard
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    onClick={() => navigate('/register')} 
                    sx={{ 
                      px: 4, py: 2, borderRadius: '12px', border: '2px solid #1a73e8', 
                      color: '#1a73e8', textTransform: 'none', fontWeight: 700
                    }}
                  >
                    Driver Registration
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <Box 
                    component="img"
                    src="https://tse3.mm.bing.net/th/id/OIP.aCYbv-xFsu2ACCPGx4K4OwHaEY?rs=1&pid=ImgDetMain"
                    alt="Dashboard Preview"
                    sx={{ 
                      width: '110%', 
                      borderRadius: '24px', 
                      boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                      transform: 'perspective(1500px) rotateY(-15deg) rotateX(5deg)',
                      border: '8px solid white'
                    }} 
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* --- STATS SECTION --- */}
      <Box sx={{ bgcolor: '#1b2559', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[ 
              { label: 'Fuel Saved', val: '35%' },
              { label: 'Bin Efficiency', val: '98%' },
              { label: 'CO2 Reduced', val: '12k Tons' }
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>{stat.val}</Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* --- FEATURES SECTION --- */}
      <Container sx={{ py: 15 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="h3" fontWeight="900" sx={{ color: '#1b2559', mb: 2 }}>
            Engineered for Precision
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Everything you need to run a modern, sustainable fleet.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                p: 4, height: '100%', borderRadius: '32px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  borderColor: item.color
                } 
              }}>
                <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, mb: 3, width: 56, height: 56 }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="800" sx={{ color: '#1b2559', mb: 1 }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>{item.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- FOOTER --- */}
      <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', pt: 10, pb: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={5}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, mb: 3 }}>
                SMART<span style={{ color: '#1a73e8' }}>WASTE</span>
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: '400px' }}>
                Leading the global transition to zero-waste urban logistics through advanced IoT and AI-driven solutions.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ bgcolor: alpha('#ffffff', 0.05), color: 'white' }}><LinkedIn /></IconButton>
                <IconButton sx={{ bgcolor: alpha('#ffffff', 0.05), color: 'white' }}><Twitter /></IconButton>
                <IconButton sx={{ bgcolor: alpha('#ffffff', 0.05), color: 'white' }}><GitHub /></IconButton>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>Platform</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2">Admin Console</Typography>
                <Typography variant="body2">Driver Mobile</Typography>
                <Typography variant="body2">API Documentation</Typography>
                <Typography variant="body2">Privacy Policy</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>Newsletter</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Get urban sanitation insights weekly.</Typography>
              {/* Add a mini-subscribe input here if needed */}
            </Grid>
          </Grid>
          <Divider sx={{ my: 6, borderColor: alpha('#ffffff', 0.1) }} />
          <Typography variant="caption" display="block" align="center">
            © {new Date().getFullYear()} SmartWaste Management Systems. Built for the future.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

// Quick helper component for the version tag
const Chip = ({ label, color }) => (
  <Box sx={{ 
    bgcolor: alpha('#1a73e8', 0.1), 
    color: '#1a73e8', 
    px: 1.5, py: 0.5, 
    borderRadius: '6px', 
    fontSize: '0.7rem', 
    fontWeight: 900 
  }}>
    {label}
  </Box>
);

export default LandingPage;