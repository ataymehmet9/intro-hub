import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRequests } from '../hooks/useRequests';
import RequestCard from '../components/requests/RequestCard';

const Requests = () => {
  const {
    sentRequests,
    receivedRequests,
    isLoading,
    error,
    fetchSentRequests,
    fetchReceivedRequests,
  } = useRequests();

  const [activeTab, setActiveTab] = useState(0);
  const [filteredSentRequests, setFilteredSentRequests] = useState([]);
  const [filteredReceivedRequests, setFilteredReceivedRequests] = useState([]);

  // Load data on component mount
  useEffect(() => {
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  // Group sent requests by status
  useEffect(() => {
    if (sentRequests) {
      setFilteredSentRequests(sentRequests);
    }
  }, [sentRequests]);

  // Group received requests by status
  useEffect(() => {
    if (receivedRequests) {
      setFilteredReceivedRequests(receivedRequests);
    }
  }, [receivedRequests]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get unique statusses for filtering
  const getUniqueStatuses = (requests) => {
    return [...new Set(requests.map(request => request.status))];
  };

  // Group requests by status
  const groupRequestsByStatus = (requests) => {
    const grouped = {};
    
    // Initialize with all possible statuses
    ['pending', 'approved', 'denied', 'completed'].forEach(status => {
      grouped[status] = [];
    });
    
    // Group requests by status
    requests.forEach(request => {
      if (grouped[request.status]) {
        grouped[request.status].push(request);
      }
    });
    
    return grouped;
  };

  const sentRequestsGrouped = groupRequestsByStatus(filteredSentRequests);
  const receivedRequestsGrouped = groupRequestsByStatus(filteredReceivedRequests);

  // Render requests for a specific status
  const renderRequestsByStatus = (requests, status, type) => {
    if (!requests || requests.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          No {status} requests
        </Typography>
      );
    }

    return requests.map(request => (
      <RequestCard key={request.id} request={request} type={type} />
    ));
  };

  // Render content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            onClick={() => {
              fetchSentRequests();
              fetchReceivedRequests();
            }}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      );
    }

    if (activeTab === 0) {
      // Outgoing Requests (Sent)
      return (
        <>
          {filteredSentRequests.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                You haven't sent any introduction requests yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Use the search page to find contacts and request introductions
              </Typography>
              <Button 
                variant="contained"
                component="a"
                href="/search"
              >
                Search for Contacts
              </Button>
            </Paper>
          ) : (
            <>
              {/* Pending Requests */}
              {sentRequestsGrouped.pending.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Pending Approval ({sentRequestsGrouped.pending.length})
                  </Typography>
                  {renderRequestsByStatus(sentRequestsGrouped.pending, 'pending', 'sent')}
                </Box>
              )}

              {/* Approved Requests */}
              {sentRequestsGrouped.approved.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Approved ({sentRequestsGrouped.approved.length})
                  </Typography>
                  {renderRequestsByStatus(sentRequestsGrouped.approved, 'approved', 'sent')}
                </Box>
              )}

              {/* Completed Requests */}
              {sentRequestsGrouped.completed.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Completed ({sentRequestsGrouped.completed.length})
                  </Typography>
                  {renderRequestsByStatus(sentRequestsGrouped.completed, 'completed', 'sent')}
                </Box>
              )}

              {/* Denied Requests */}
              {sentRequestsGrouped.denied.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Denied ({sentRequestsGrouped.denied.length})
                  </Typography>
                  {renderRequestsByStatus(sentRequestsGrouped.denied, 'denied', 'sent')}
                </Box>
              )}
            </>
          )}
        </>
      );
    } else {
      // Incoming Requests (Received)
      return (
        <>
          {filteredReceivedRequests.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                You haven't received any introduction requests yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                When someone requests an introduction to one of your contacts, it will appear here
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Pending Requests */}
              {receivedRequestsGrouped.pending.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Pending Your Approval ({receivedRequestsGrouped.pending.length})
                  </Typography>
                  {renderRequestsByStatus(receivedRequestsGrouped.pending, 'pending', 'received')}
                </Box>
              )}

              {/* Approved Requests */}
              {receivedRequestsGrouped.approved.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Approved ({receivedRequestsGrouped.approved.length})
                  </Typography>
                  {renderRequestsByStatus(receivedRequestsGrouped.approved, 'approved', 'received')}
                </Box>
              )}

              {/* Completed Requests */}
              {receivedRequestsGrouped.completed.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Completed ({receivedRequestsGrouped.completed.length})
                  </Typography>
                  {renderRequestsByStatus(receivedRequestsGrouped.completed, 'completed', 'received')}
                </Box>
              )}

              {/* Denied Requests */}
              {receivedRequestsGrouped.denied.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Denied ({receivedRequestsGrouped.denied.length})
                  </Typography>
                  {renderRequestsByStatus(receivedRequestsGrouped.denied, 'denied', 'received')}
                </Box>
              )}
            </>
          )}
        </>
      );
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4 }}>
        Introduction Requests
      </Typography>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`Outgoing (${sentRequests?.length || 0})`} />
          <Tab label={`Incoming (${receivedRequests?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* Content */}
      {renderContent()}
    </Container>
  );
};

export default Requests;
