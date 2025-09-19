import React, { createContext, useState, useEffect } from "react";

import { useAuth } from "@hooks/useAuth";
import {
  getRequests,
  createRequest,
  updateRequestStatus,
  searchContacts,
} from "@services/requests";
import { toast } from "@components/ui/notification";

export type Request = {
  id: number;
  sender: any;
  receiver: any;
  status: string;
  [key: string]: any;
};

export type RequestContextType = {
  sentRequests: Request[];
  receivedRequests: Request[];
  isLoading: boolean;
  error: string | null;
  fetchAllRequests: () => Promise<void>;
  fetchSentRequests: () => Promise<Request[]>;
  fetchReceivedRequests: () => Promise<Request[]>;
  addRequest: (requestData: Partial<Request>) => Promise<Request>;
  updateStatus: (id: number, status: string) => Promise<Request>;
  searchContacts: (query: string) => Promise<any[]>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const RequestContext = createContext<RequestContextType | undefined>(
  undefined
);

export const RequestProvider = ({ children }: React.PropsWithChildren) => {
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchAllRequests = async (): Promise<void> => {
    try {
      await Promise.all([fetchSentRequests(), fetchReceivedRequests()]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError("Failed to fetch requests");
      toast({ title: "Failed to fetch requests", variant: "error" });
    }
  };

  const fetchSentRequests = async (): Promise<Request[]> => {
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

  const fetchReceivedRequests = async (): Promise<Request[]> => {
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

  const addRequest = async (
    requestData: Partial<Request>
  ): Promise<Request> => {
    try {
      setIsLoading(true);
      setError(null);
      const newRequest = await createRequest(requestData);
      setSentRequests((prevRequests) => [newRequest, ...prevRequests]);
      toast({
        title: "Introduction request sent successfully",
        variant: "success",
      });
      return newRequest;
    } catch (error) {
      setError("Failed to send request");
      toast({ title: "Failed to send request", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string): Promise<Request> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedRequest = await updateRequestStatus(id, { status });

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

      toast({ title: message, variant: "success" });
      return updatedRequest;
    } catch (error) {
      setError("Failed to update request status");
      toast({ title: "Failed to update request status", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const search = async (query: string): Promise<any[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchContacts(query);
      return results;
    } catch (error) {
      setError("Failed to search contacts");
      toast({ title: "Failed to search contacts", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: RequestContextType = {
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
