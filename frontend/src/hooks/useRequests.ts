import { useContext } from "react";
import {
  RequestContext,
  type Request,
  type RequestContextType,
} from "@context/RequestContext";

export type { Request, RequestContextType };

/**
 * Custom hook to provide access to the RequestContext
 * @returns Request context values and methods
 */
export const useRequests = () => {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error("useRequests must be used within a RequestProvider");
  }

  return context;
};
