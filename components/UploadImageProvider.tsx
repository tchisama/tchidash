"use client";
"use client";
import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Label } from "@/components/ui/label";

type Props = {
  children: React.ReactNode;
  folder: string;
  name: string;
  callback: (
    url: string,
    size: number,
    width: number,
    height: number,
    format: string,
    path: string,
  ) => void;
};

function UploadImageProvider({ children, folder, name, callback }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Read image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const width = img.width;
    const height = img.height;
    const format = file.type.split("/")[1];

    setUploading(true);
    try {
      const storageRef = ref(getStorage(), `${folder}/${name}.${format}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      callback(url, file.size, width, height, format, storageRef.fullPath);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={`file-upload-${name}`}
      />
      <Label 
        htmlFor={`file-upload-${name}`}
        className="cursor-pointer"
      >
        {uploading ? "Uploading..." : children}
      </Label>
    </div>
  );
}

export default UploadImageProvider;
