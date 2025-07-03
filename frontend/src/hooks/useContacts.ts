import { useContext } from "react";
import { ContactContext, type Contact } from "@context/ContactContext";

export type { Contact };

/**
 * Custom hook to provide access to the ContactContext
 * @returns Contact context values and methods
 */
export const useContacts = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContacts must be used within a ContactProvider");
  }

  return context;
};
