import { useContext } from "react";

import { ContactContext } from "../contexts/ContactContext";

/**
 * Custom hook to provide access to the ContactContext
 * @returns {Object} - Contact context values and methods
 */
export const useContacts = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContacts must be used within a ContactProvider");
  }

  return context;
};
