import { useState } from 'react';
import { uploadFileInChunks } from '../services/apiService';

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = (file) => {
    setUploading(true);
    uploadFileInChunks(file, setProgress, setError, setUploading);
  };

  return { progress, uploading, error, upload };
};
