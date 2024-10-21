"use client";
"use client";
import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `${folder}/${name}`);

      const size = file.size / 1024 / 1024;
      if (size > 4) {
        alert("The file is too large! Please upload a file smaller than 4MB.");
        return;
      }
      const imageExtension = file.name.split(".").pop() as
        | "jpg"
        | "png"
        | "gif"
        | "webp";
      const path = `${folder}/${name}`;

      // Read the image to get width and height
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async function () {
          const width = img.width;
          const height = img.height;

          console.log(`Image width: ${width}px, height: ${height}px`);

          setUploading(true);
          try {
            // Upload the file
            const snapshot = await uploadBytes(storageRef, file);
            console.log("Uploaded a blob or file!", snapshot);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);

            // Pass the URL, size, width, and height to the callback
            callback(
              downloadURL,
              size,
              width,
              height,
              imageExtension ?? "jpg",
              path,
            );
          } catch (error) {
            console.error("Error uploading file:", error);
          } finally {
            setUploading(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file); // Convert file to data URL for Image
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
