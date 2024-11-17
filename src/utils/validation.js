export const validateFileSize = (file, maxSize) => {
    return file.size <= maxSize;
  };
  
  export const validateFileType = (file, acceptedTypes) => {
    return acceptedTypes.includes(file.type);
  };
  