"use client";

import { useState } from "react";
import FormField from "./FormField";

export default function FileUploader({ id, name, label }) {
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  };

  return (
    <div>
      <FormField
        label={label}
        id={id}
        name={name}
        type="file"
        onChange={handleFileChange}
      />
      <div className="mb-4">
        <div className="rounded-lg border border-primary/20 overflow-hidden neon-box-glow-sm">
          <div className="p-4">
            {previewSrc ? (
              <img
                id="preview"
                src={previewSrc}
                className="w-full h-auto rounded"
                alt="Preview"
              />
            ) : (
              <p className="text-muted-foreground">No file selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
