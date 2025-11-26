import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";

export const protectedRoutes: Routes = {
  "/dashboard": {
    key: "dashboard",
    authority: [],
    meta: {
      pageBackgroundType: "plain",
      pageContainerType: "contained",
    },
  },
  "/contacts": {
    key: "contacts",
    authority: [],
    meta: {
      pageBackgroundType: "plain",
      pageContainerType: "contained",
    },
  },
  "/requests": {
    key: "requests",
    authority: [],
    meta: {
      pageBackgroundType: "plain",
      pageContainerType: "contained",
    },
  },
  "/search": {
    key: "search",
    authority: [],
    meta: {
      pageBackgroundType: "plain",
      pageContainerType: "contained",
    },
  },
  "/profile": {
    key: "profile",
    authority: [],
    meta: {
      pageBackgroundType: "plain",
      pageContainerType: "contained",
    },
  },
};

export const publicRoutes: Routes = {};

export const authRoutes = authRoute;
