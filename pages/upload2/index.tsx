import React, { useState } from 'react';

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Handle the response from your API
        })
        .catch((error) => {
          console.error(error);
          // Handle error cases
        });
    }
  };

  return (
    <div className="container">
      <div className="preview">
        {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
      </div>
      <div className="upload">
        <label htmlFor="file-input" className="file-input-label">
          Select File
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleUpload} disabled={!selectedFile} className="upload-button">
          Upload Image
        </button>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .preview {
          margin-bottom: 20px;
        }

        .preview-image {
          max-width: 300px;
          height: auto;
        }

        .file-input-label {
          background-color: #0070f3;
          color: #fff;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .file-input-label:hover {
          background-color: #0058c1;
        }

        .file-input {
          display: none;
        }

        .upload-button {
          background-color: #0070f3;
          color: #fff;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .upload-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
