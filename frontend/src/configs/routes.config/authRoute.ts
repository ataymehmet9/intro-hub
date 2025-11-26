import type { Routes } from "@/@types/routes";

const dashboardsRoute: Routes = {
  "/login": {
    key: "login",
    authority: [],
  },
  "/signup": {
    key: "signup",
    authority: [],
  },
  "/forgot-password": {
    key: "forgotPassword",
    authority: [],
  },
  "/reset-password": {
    key: "resetPassword",
    authority: [],
  },
  "/otp-verification": {
    key: "otpVerification",
    authority: [],
  },
};

export default dashboardsRoute;
