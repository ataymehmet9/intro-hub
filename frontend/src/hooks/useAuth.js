import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";

/**
 * Custom hook to provide access to the AuthContext
 * @returns {Object} - Auth context values and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
