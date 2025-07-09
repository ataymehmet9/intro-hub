import React, { ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";

type LinkType = {
  title: string;
  to?: string;
  className?: string;
};

type BreadcrumbProps = {
  rootLink: LinkType;
  links: LinkType[];
  divider?: string | ReactNode;
  icon?: ReactNode;
  className?: string;
};

export default function Breadcrumb({
  rootLink,
  links,
  divider,
  icon,
  className,
}: BreadcrumbProps) {
  return (
    <nav>
      <ol className={clsx("flex flex-wrap items-center gap-1.5", className)}>
        <li>
          <Link
            className={clsx(
              "inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400",
              rootLink.className
            )}
            to={rootLink.to as string}
          >
            {icon && icon}
            {rootLink.title}
          </Link>
        </li>
        {links.map((link) => (
          <li
            key={link.to}
            className={clsx({
              "flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90":
                !link.to,
              [link.className as string]: !link.to && link.className,
            })}
          >
            {divider ? (
              divider
            ) : (
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {link.to ? (
              <Link
                to={link.to}
                className={clsx(
                  (className =
                    "flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"),
                  link.className
                )}
              >
                <span>{link.title}</span>
              </Link>
            ) : (
              <span>{link.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
