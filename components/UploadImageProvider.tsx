"use client";
"use client";
import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Props = {
  children: React.ReactNode;
  folder: string;
  name: string;
  callback: (url: string) => void;
};

function UploadImageProvider({ children, folder, name, callback }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `${folder}/${name}`);

      setUploading(true);
      try {
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        console.log("Uploaded a blob or file!", snapshot);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        callback(downloadURL); // Trigger the callback with the image URL
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="">
      <input
        type="file"
        onChange={handleChange}
        className="hidden"
        id={"image" + name}
        accept="image/*"
        disabled={uploading}
      />
      <label className="cursor-pointer" htmlFor={"image" + name}>
        {uploading ? "Uploading..." : children}
      </label>
    </div>
  );
}

export default UploadImageProvider;
