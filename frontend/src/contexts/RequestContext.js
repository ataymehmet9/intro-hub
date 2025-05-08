import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "notistack";

import { useAuth } from "../hooks/useAuth";
import {
  getRequests,
  createRequest,
  updateRequestStatus,
  searchContacts,
} from "../services/requests";

// Create the context
export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch requests when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllRequests();
    }
  }, [isAuthenticated]);

  // Fetch all requests (both sent and received)
  const fetchAllRequests = async () => {
    try {
      await Promise.all([fetchSentRequests(), fetchReceivedRequests()]);
    } catch (error) {
      setError("Failed to fetch requests");
      enqueueSnackbar("Failed to fetch requests", { variant: "error" });
    }
  };

  // Fetch sent requests
  const fetchSentRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRequests("sent");
      setSentRequests(data);
      return data;
    } catch (error) {
      setError("Failed to fetch sent requests");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch received requests
  const fetchReceivedRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRequests("received");
      setReceivedRequests(data);
      return data;
    } catch (error) {
      setError("Failed to fetch received requests");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new request
  const addRequest = async (requestData) => {
    try {
      setIsLoading(true);
      setError(null);
      const newRequest = await createRequest(requestData);
      setSentRequests((prevRequests) => [newRequest, ...prevRequests]);
      enqueueSnackbar("Introduction request sent successfully", {
        variant: "success",
      });
      return newRequest;
    } catch (error) {
      setError("Failed to send request");
      enqueueSnackbar("Failed to send request", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update request status
  const updateStatus = async (id, status) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedRequest = await updateRequestStatus(id, { status });

      // Update the request in the correct list
      setReceivedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? updatedRequest : request
        )
      );

      let message = "";
      if (status === "approved") {
        message = "Request approved. An introduction email has been sent.";
      } else if (status === "denied") {
        message = "Request denied.";
      } else {
        message = "Request status updated.";
      }

      enqueueSnackbar(message, { variant: "success" });
      return updatedRequest;
    } catch (error) {
      setError("Failed to update request status");
      enqueueSnackbar("Failed to update request status", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Search for contacts
  const search = async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchContacts(query);
      return results;
    } catch (error) {
      setError("Failed to search contacts");
      enqueueSnackbar("Failed to search contacts", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    sentRequests,
    receivedRequests,
    isLoading,
    error,
    fetchAllRequests,
    fetchSentRequests,
    fetchReceivedRequests,
    addRequest,
    updateStatus,
    searchContacts: search,
  };

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};
