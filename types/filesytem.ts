//export type FolderType = {
//  id: string;
//  name: string;
//  motherFolder: string;
//  storeId: string;
//  createdAt: string;
//  updatedAt: string;
//};
//
//export type Image = {
//  id: string;
//  name: string;
//  motherFolder: string;
//  storeId: string;
//  storagePath: string;
//};

import { Timestamp } from "firebase/firestore";

export type FileSystemItem = FolderType | ImageItemType;

export type FolderType = {
  id: string; // Unique ID of the folder
  name: string; // Folder name
  parentFolderId: string; // Optional ID of the parent folder
  //parentsFolders: { id: string; name: string }[]; // Array of parent folders
  storeId: string; // Associated store or project ID
  path: string; // Full path for easier reference

  folderType?: "regular" | "archive" | "shared"; // Type of folder, defaults to regular
  createdAt: Timestamp; // Creation timestamp
  updatedAt?: Timestamp; // Last update timestamp
  type: "folder"; // Type of the item
  tags?: string[]; // Optional tags for better categorization
};

export type ImageItemType = {
  id: string; // Unique ID of the image
  name: string; // Image name
  parentFolderId: string; // Folder that the image belongs to
  url: string; // URL to the image file
  storeId: string; // Associated store ID
  storagePath: string; // File path or storage reference (e.g., in cloud storage)
  thumbnailPath?: string; // Optional path to the image thumbnail
  size: number; // Size of the image file in bytes
  width: number; // Width of the image in pixels
  height: number; // Height of the
  format: "jpg" | "png" | "gif" | "webp"; // Image format
  visibility?: "public" | "private"; // Visibility of the image
  dimensions?: { width: number; height: number }; // Optional dimensions of the image
  tags?: string[]; // Optional tags for better categorization
  createdAt: Timestamp; // Creation timestamp
  updatedAt?: Timestamp; // Last update timestamp
  type: "image"; // Type of the item
};
