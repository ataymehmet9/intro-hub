import React, { useRef } from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A reusable file upload button component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFileSelect - Callback function when file is selected
 * @param {string} props.accept - Accepted file types
 * @param {boolean} props.multiple - Allow multiple file selection
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.buttonProps - Additional props for the Button component
 */
const FileUploadButton = ({
  onFileSelect,
  accept,
  multiple = false,
  children,
  ...buttonProps
}) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    if (multiple) {
      onFileSelect(Array.from(files));
    } else {
      onFileSelect(files[0]);
    }
    
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
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

FileUploadButton.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default FileUploadButton;
