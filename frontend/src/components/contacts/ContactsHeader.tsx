import React from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@components/ui/button";
import { Input } from "@components/form/input";

type ContactsHeaderProps = {
  handleAddContact: () => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm?: string;
};

const ContactsHeader: React.FC<ContactsHeaderProps> = ({
  handleAddContact,
  handleSearchChange,
  searchTerm,
}) => {
  return (
    <>
      <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
        <div className="flex flex-col w-full gap-5 sm:justify-between md:flex-row xl:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form>
              <Input
                name="text"
                className="h-[42px] border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                prefix={
                  <button
                    type="button"
                    className="absolute -translate-y-1/2 left-4 top-1/2"
                  >
                    <MagnifyingGlassIcon className="size-5" />
                  </button>
                }
                suffix={
                  searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSearchChange(
                          {} as React.ChangeEvent<HTMLInputElement>
                        )
                      }
                      className="absolute -translate-y-1/2 right-4 top-1/2"
                    >
                      <XMarkIcon className="cursor-pointer size-4" />
                    </button>
                  )
                }
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <Button
              size="sm"
              onClick={handleAddContact}
              endIcon={<PlusIcon className="size-5" />}
            >
              Add Contact
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactsHeader;
