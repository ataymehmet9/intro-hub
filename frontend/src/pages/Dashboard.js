import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Contacts as ContactsIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useContacts } from '../hooks/useContacts';
import { useRequests } from '../hooks/useRequests';
import RequestCard from '../components/requests/RequestCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { contacts, isLoading: contactsLoading, fetchContacts } = useContacts();
  const { 
    sentRequests, 
    receivedRequests, 
    isLoading: requestsLoading, 
    fetchSentRequests,
    fetchReceivedRequests,
  } = useRequests();
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentSentRequests, setRecentSentRequests] = useState([]);

  useEffect(() => {
    fetchContacts();
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  // Filter pending received requests
  useEffect(() => {
    if (receivedRequests) {
      const pending = receivedRequests.filter(request => request.status === 'pending');
      setPendingRequests(pending);
    }
  }, [receivedRequests]);

  // Get recent sent requests
  useEffect(() => {
    if (sentRequests) {
      const recent = [...sentRequests].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 3);
      setRecentSentRequests(recent);
    }
  }, [sentRequests]);

  const isLoading = contactsLoading || requestsLoading;

  return (
    <Container maxWidth="lg">
      {/* Welcome section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.first_name || 'User'}!
            </Typography>
            <Typography variant="body1">
              Connect with your network and grow your business relationships through warm introductions.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              component={RouterLink}
              to="/search"
              variant="contained"
              color="secondary"
              startIcon={<SearchIcon />}
              sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
            >
              Find Contacts
            </Button>
            <Button
              component={RouterLink}
              to="/contacts"
              variant="outlined"
              color="inherit"
              startIcon={<AddIcon />}
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Add Contacts
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Left column - Stats */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Network Stats */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Network
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h4" align="center">
                        {contacts.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Contacts
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h4" align="center">
                        {sentRequests.length + receivedRequests.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Introductions
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Links
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    <Button
                      component={RouterLink}
                      to="/contacts"
                      startIcon={<ContactsIcon />}
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Manage Contacts
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/search"
                      startIcon={<SearchIcon />}
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Search for Leads
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/requests"
                      startIcon={<SwapHorizIcon />}
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Manage Requests
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right column - Requests */}
          <Grid item xs={12} md={8}>
            {/* Pending Requests */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Pending Approval ({pendingRequests.length})
                </Typography>
                {pendingRequests.length > 0 && (
                  <Button
                    component={RouterLink}
                    to="/requests"
                    size="small"
                    endIcon={<SwapHorizIcon />}
                  >
                    View All
                  </Button>
                )}
              </Box>
              
              {pendingRequests.length > 0 ? (
                pendingRequests.slice(0, 3).map((request) => (
                  <RequestCard key={request.id} request={request} type="received" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No pending requests to approve.
                </Typography>
              )}
            </Paper>

            {/* Recent Sent Requests */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Your Recent Requests
                </Typography>
                {recentSentRequests.length > 0 && (
                  <Button
                    component={RouterLink}
                    to="/requests"
                    size="small"
                    endIcon={<SwapHorizIcon />}
                  >
                    View All
                  </Button>
                )}
              </Box>
              
              {recentSentRequests.length > 0 ? (
                recentSentRequests.map((request) => (
                  <RequestCard key={request.id} request={request} type="sent" />
                ))
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    You haven't made any introduction requests yet.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/search"
                    variant="contained"
                    startIcon={<SearchIcon />}
                    sx={{ mt: 1 }}
                  >
                    Find Contacts
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
