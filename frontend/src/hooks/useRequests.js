import { useContext } from "react";

import { RequestContext } from "../contexts/RequestContext";

/**
 * Custom hook to provide access to the RequestContext
 * @returns {Object} - Request context values and methods
 */
export const useRequests = () => {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error("useRequests must be used within a RequestProvider");
  }

  return context;
};
