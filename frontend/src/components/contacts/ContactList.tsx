import React, { useState } from "react";
import clsx from "clsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { useContacts, type Contact } from "@hooks/useContacts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { TableDropdown } from "@components/common";

type ContactListProps = {
  contacts: Contact[];
  handleEdit: (contact: Contact) => void; // Optional edit handler
};

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  handleEdit,
}) => {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { removeContact } = useContacts();

  const handleDelete = async (contact: Contact) => {
    setIsDeleting(contact.id);

    try {
      await removeContact(contact.id);
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="max-w-full px-5 overflow-x-auto sm:px-6">
        {!contacts ||
          (contacts.length === 0 ? (
            <p>No contacts found. Please add some contacts to get started.</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 border-b dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-4 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-4 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Company
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-4 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Job Title
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-4 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    &nbsp;
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className={clsx({
                      "opacity-50": isDeleting === contact.id,
                    })}
                  >
                    <TableCell className="py-4 text-gray-800 dark:text-white/90">
                      {contact.full_name}
                    </TableCell>
                    <TableCell className="py-4 text-gray-800 dark:text-white/90">
                      {contact.company}
                    </TableCell>
                    <TableCell className="py-4 text-gray-800 dark:text-white/90">
                      {contact.position}
                    </TableCell>
                    <TableCell className="py-4 text-gray-800 dark:text-white/90">
                      <div className="relative inline-block">
                        <TableDropdown
                          dropdownButton={
                            <button className="text-gray-500 dark:text-gray-400 ">
                              <EllipsisHorizontalIcon className="size-5" />
                            </button>
                          }
                          dropdownContent={
                            <>
                              <button
                                onClick={() => handleEdit(contact)}
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(contact)}
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Delete
                              </button>
                            </>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
      </div>
    </div>
  );
};
