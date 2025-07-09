import { useState, useCallback } from "react";

import { type VerticalTabData } from "./Tabs.types";

type VerticalTabProps = {
  tabs: VerticalTabData[];
};

const VerticalTab: React.FC<VerticalTabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? "");

  const renderTabContent = useCallback(() => {
    const activeTabData = tabs.find((tab) => tab.id === activeTab);
    if (!activeTabData) return null;

    return (
      <div>
        {!activeTabData.hideHeader && (
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
            {activeTabData.label}
          </h3>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {activeTabData.content}
        </p>
      </div>
    );
  }, [activeTab, tabs]);

  return (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Sidebar Navigation */}
        <div className="overflow-x-auto pb-2 sm:w-[200px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5">
          <nav className="flex flex-row w-full sm:flex-col sm:space-y-2">
            {tabs.map(({ id, label }) => (
              <button
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 ${
                  activeTab === id
                    ? "text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50"
                    : "bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default VerticalTab;
