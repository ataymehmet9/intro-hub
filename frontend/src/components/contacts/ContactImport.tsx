import React from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import { ComponentCard } from "@components/common";

const ContactImport: React.FC = () => {
  const onDrop = (acceptedFiles: File[]) => {
    console.log("Files dropped", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <ComponentCard title="Import Contacts - Bulk Upload">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
          id="contacts-upload"
        >
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <ArrowUpTrayIcon className="size-7" />
              </div>
            </div>

            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Import contacts here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse Files
            </span>
          </div>
        </form>
      </div>
    </ComponentCard>
  );
};

export default ContactImport;
