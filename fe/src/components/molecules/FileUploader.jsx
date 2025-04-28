"use client";

import { useState } from "react";
import { FileText, ImageIcon, FileIcon, X } from "lucide-react";

export default function FileUploader({
  id,
  name,
  label,
  onChange,
  error,
  value,
}) {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Call parent onChange
    onChange(e);

    // Determine file type
    const type = file.type.split("/")[0];
    setFileType(type);

    // Create preview for images
    if (type === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setPreview(null);
    setFileType("");
    // Create a synthetic event to clear the file input
    const event = {
      target: {
        name,
        files: [],
        value: "",
      },
    };
    onChange(event);
  };

  const getFileIcon = () => {
    if (fileType === "image")
      return <ImageIcon className="w-12 h-12 text-primary" />;
    if (value?.endsWith(".pdf"))
      return <FileText className="w-12 h-12 text-primary" />;
    return <FileIcon className="w-12 h-12 text-primary" />;
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium neon-text mb-2">
        {label}
      </label>

      {/* File Preview Section */}
      {(preview || value) && (
        <div className="mb-4 p-4 border border-primary/20 rounded-lg bg-background/50 relative">
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-destructive" />
          </button>

          {preview ? (
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-40 max-w-full object-contain mb-2 rounded"
              />
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <p className="text-sm font-medium text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">
                  {fileType === "application" ? "Document" : fileType} file
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
          error
            ? "border-destructive"
            : "border-primary/30 hover:border-primary/60"
        } bg-background/50 transition-colors`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          <svg
            className="w-8 h-8 mb-3 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-muted-foreground">
            Supports images (JPG, PNG), PDFs, and documents
          </p>
        </div>
        <input
          id={id}
          name={name}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
      </label>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
