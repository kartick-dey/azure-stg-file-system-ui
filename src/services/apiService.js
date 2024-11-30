import axiosInstance from './axiosInstance';

export const uploadFileInChunks = async (file, setProgress, setError, setUploading) => {
    try {
        const chunkSize = 0.5 * 1024 * 1024; // 0.5 MB
        const totalChunks = Math.ceil(file.size / chunkSize);
        console.log('Uploading file in chunks:', { fileSize: file.size, totalChunks });

        let uploadedBytes = 0; // Keep track of total bytes uploaded

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const chunk = file.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize);

            // Capture the current chunk's size in a local variable for this iteration
            const currentChunkSize = chunk.size;

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', chunkIndex);
            formData.append('totalChunks', totalChunks);
            formData.append('fileName', file.name);

            await axiosInstance.post('/v1/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                // eslint-disable-next-line no-loop-func
                onUploadProgress: (progressEvent) => {
                    // Calculate progress for the current chunk
                    const chunkProgress = progressEvent.loaded / currentChunkSize;

                    // Update total progress safely
                    const totalProgress = Math.round(
                        ((uploadedBytes + chunkProgress * currentChunkSize) / file.size) * 100,
                    );

                    setProgress(totalProgress);
                },
            });

            // Safely update the total uploaded bytes after the chunk upload is complete
            uploadedBytes += currentChunkSize;
        }

        setUploading(false);
        alert('File uploaded successfully');
    } catch (error) {
        setUploading(false);
        setError(error.response?.data?.message || 'Failed to upload file');
        console.error('Upload error:', error);
    }
};

export const handleDownload = async (fileId, setProgress, setError, setIsDownloading) => {
    setIsDownloading(true);
    setProgress(0);
    setError(null);

    try {
        const response = await axiosInstance.get(`/v1/file/${fileId}/download`, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                const total = progressEvent.total || response.headers['content-length'];
                if (total) {
                    const percentage = Math.round((progressEvent.loaded * 100) / total);
                    setProgress(percentage);
                }
            },
        });
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileId;
        a.click();
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        setError('Error downloading file. Please try again.');
        console.error(error);
    } finally {
        setIsDownloading(false);
    }
};
