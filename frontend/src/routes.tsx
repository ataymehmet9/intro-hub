import React, { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@hooks/useAuth";

// Layouts
import AppLayout from "@layout/AppLayout";
import AuthLayout from "@layout/AuthLayout";

// Auth Pages
import Login from "@pages/auth/Login";
import Signup from "@pages/auth/Signup";

// Main Pages
import Dashboard from "@pages/Dashboard";
import Contacts from "@pages/Contacts";
import Search from "@pages/Search";
import Requests from "@pages/Requests";
import Profile from "@pages/Profile";

// Other Pages
import NotFound from "@pages/NotFound";
import Maintenance from "@pages/Maintenance";
import FiveZeroThree from "@pages/FiveZeroThree";
import FiveZeroZero from "@pages/FiveZeroZero";
import ComingSoon from "@pages/ComingSoon";

type RouteGuardProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route index path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <Contacts />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <Requests />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthLayout>
              <Signup />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Other pages */}
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/503" element={<FiveZeroThree />} />
      <Route path="/500" element={<FiveZeroZero />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
