import { BrowserRouter as Router } from "react-router";

import { ScrollToTop } from "@components/common";
import AppRoutes from "./routes";
import { AuthProvider } from "@context/AuthContext";
import { ContactProvider } from "@context/ContactContext";
import { RequestProvider } from "@context/RequestContext";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <ContactProvider>
            <RequestProvider>
              <AppRoutes />
            </RequestProvider>
          </ContactProvider>
        </AuthProvider>
      </Router>
    </>
  );
}
