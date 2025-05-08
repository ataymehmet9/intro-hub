import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import { Handshake as HandshakeIcon } from '@mui/icons-material';

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
            }}
          >
            <HandshakeIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
            Intro-Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Connect your network to build valuable business relationships
          </Typography>
          <Divider sx={{ width: '100%', mb: 3 }} />
          
          {children}
          
          <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Intro-Hub. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link to="/terms" style={{ textDecoration: 'none', color: 'primary.main', marginRight: 16 }}>
                Terms of Service
              </Link>
              <Link to="/privacy" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
