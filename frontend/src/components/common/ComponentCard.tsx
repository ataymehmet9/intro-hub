import React from "react";

interface ComponentCardProps {
  children: React.ReactNode;
  header?: React.ReactNode; // Optional header content
  className?: string; // Additional custom classes for styling
  title?: string;
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  children,
  header,
  title = "",
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {header && header}
      {!header && (title || desc) && (
        <div className="px-6 py-5">
          {title && (
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
          )}
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
