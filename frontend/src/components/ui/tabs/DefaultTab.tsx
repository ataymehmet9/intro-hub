import { useState } from "react";

import { type TabData } from "./Tabs.types";

type DefauiltTabProps = {
  tabs: TabData[];
};

interface TabButtonProps {
  tab: TabData;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
        isActive
          ? "bg-white text-gray-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white"
          : "bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
    >
      {tab.icon && tab.icon}
      {tab.label}
      {tab.count && (
        <span className="inline-block items-center justify-center rounded-full bg-brand-50 px-2 py-0.5 text-center text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
          {tab.count}
        </span>
      )}
    </button>
  );
};

interface TabContentProps {
  tab: TabData;
  isActive: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ tab, isActive }) => {
  if (!isActive) return null;

  return (
    <div>
      <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
        {tab.label}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{tab.content}</p>
    </div>
  );
};

const DefaultTab: React.FC<DefauiltTabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div>
      <div className="p-3 border border-gray-200 rounded-t-xl dark:border-gray-800">
        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-900 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>
      <div className="p-6 pt-4 border border-t-0 border-gray-200 rounded-b-xl dark:border-gray-800">
        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabContent key={tab.id} tab={tab} isActive={activeTab === tab.id} />
        ))}
      </div>
    </div>
  );
};

export default DefaultTab;
