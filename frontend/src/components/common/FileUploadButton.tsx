import React, { useRef, ChangeEvent, ReactNode } from "react";
import { Button, ButtonProps } from "@mui/material";

type FileUploadButtonProps = {
  onFileSelect: (file: File | File[]) => void;
  accept?: string;
  multiple?: boolean;
  children: ReactNode;
} & ButtonProps;

/**
 * A reusable file upload button component
 */
const FileUploadButton = ({
  onFileSelect,
  accept,
  multiple = false,
  children,
  ...buttonProps
}: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (multiple) {
      onFileSelect(Array.from(files));
    } else {
      onFileSelect(files[0]);
    }

    // Reset the input value to allow selecting the same file again
    event.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
      <Button onClick={handleButtonClick} {...buttonProps}>
        {children}
      </Button>
    </>
  );
};

export default FileUploadButton;
