import React from "react";

export type TabData = {
  id: string;
  label: string;
  content: React.ReactNode;
  count?: number;
  icon?: React.ReactNode;
};

export type VerticalTabData = Omit<TabData, "icon" | "count"> & {
  hideHeader?: boolean;
};
