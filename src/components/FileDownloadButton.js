import React, { useState } from 'react';
import { handleDownload } from '../services/apiService';

const FileDownloadButton = () => {
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const handleFileDownload = () => {
        handleDownload(fileName, setProgress, setError, setIsDownloading);
    };
    return (
        <div style={{ width: '300px', margin: '0 auto', textAlign: 'center' }}>
            <input type='text' onChange={(e) => setFileName(e.target.value)} />
            <button onClick={handleFileDownload} disabled={isDownloading}>
                {isDownloading ? 'Downloading...' : 'Download File'}
            </button>
            {isDownloading && (
                <div style={{ marginTop: '10px' }}>
                    <progress value={progress} max='100' style={{ width: '100%' }} />
                    <p>{progress}%</p>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileDownloadButton;
