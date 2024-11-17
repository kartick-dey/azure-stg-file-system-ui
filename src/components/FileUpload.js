import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFileInChunks } from '../services/apiService'; // API service import

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
        },
        accept: 'image/*, video/*, application/*',
    });

    const handleUpload = () => {
        if (file) {
            setUploading(true);
            uploadFileInChunks(file, setProgress, setError, setUploading);
        }
    };

    return (
        <div style={{ padding: '20px', margin: '2rem' }}>
            <div {...getRootProps()} style={{ border: '2px dashed #007bff', marginBottom: '1rem' }}>
                <input {...getInputProps()} />
                {!file ? (
                    <p style={{ textAlign: 'center' }}>Drag & drop a file or click to select a file</p>
                ) : (
                    <p style={{ marginLeft: '1rem'}}>{file.name}</p>
                )}
            </div>
            {file && !uploading && <button onClick={handleUpload}>Upload</button>}
            {uploading && <progress value={progress} max='100'></progress>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileUpload;
