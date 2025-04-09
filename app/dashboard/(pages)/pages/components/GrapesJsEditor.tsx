// app/components/GrapesJsEditor.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import "grapesjs/dist/css/grapes.min.css";
import "../styles/grapesjs-light-theme.css"; // Keep our light theme
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
// Import plugin for basic blocks if you want more core elements easily
// import gjsBasicBlocks from 'grapesjs-blocks-basic'; // Example: npm install grapesjs-blocks-basic
import { basicElements, layoutElements } from "../data/elements"; // Custom blocks
import { heroSections, productSections } from "../data/sections";

function GrapesJsEditor() {
  const [editor, setEditor] = useState(null);
  const editorContainerRef = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      editorContainerRef.current &&
      !editor
    ) {
      const editorInstance = grapesjs.init({
        container: editorContainerRef.current,
        height: "95vh", // Adjusted height slightly
        width: "auto",
        storageManager: { type: null }, // Keep storage simple for now
        // Use plugins
        plugins: [
          gjsPresetWebpage,
          // gjsBasicBlocks // Uncomment if you installed and want its blocks
        ],
        pluginsOpts: {
          [gjsPresetWebpage]: {
            /* options */
          },
          // [gjsBasicBlocks]: { /* options */} // Uncomment for basic blocks config
        },
        // Configure Asset Manager for Uploads
        assetManager: {
          // Upload endpoint (will be used by the fetch request in `uploadFile`)
          upload: "/api/upload", // Matches our API route
          uploadName: "files", // Matches the key expected in the API route's formData
          multiUpload: true, // Allow multiple file selection
          // Custom upload function (more control over the request)
          uploadFile: async (e) => {
            const files = e.dataTransfer
              ? e.dataTransfer.files
              : e.target.files;
            if (!files || files.length === 0) {
              console.log("No files selected for upload.");
              return;
            }

            const formData = new FormData();
            for (const file of files) {
              formData.append("files", file); // Key must match API expectation
            }

            try {
              const response = await fetch("/api/upload", {
                // Use the upload endpoint URL
                method: "POST",
                body: formData,
                // Add headers if needed (e.g., authorization)
                // headers: {
                //   'Authorization': 'Bearer YOUR_TOKEN'
                // }
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  `Upload failed: ${response.statusText} - ${errorData.error || errorData.details || "Unknown error"}`,
                );
              }

              const result = await response.json(); // Expecting { data: [url1, url2...] }

              if (
                result.data &&
                Array.isArray(result.data) &&
                result.data.length > 0
              ) {
                // Add the uploaded images to the Asset Manager
                // GrapesJS `add` method expects an array of objects or URLs
                editorInstance.AssetManager.add(result.data);
                console.log("Assets added to manager:", result.data);
              } else {
                console.warn(
                  "Upload API returned no data or invalid format:",
                  result,
                );
                alert(
                  "Upload completed, but no valid image URLs were returned.",
                );
              }
            } catch (error) {
              console.error("Error during custom upload:", error);
              alert(`Error uploading file: ${error.message}`);
              // Optionally provide more user feedback
              editorInstance.Modal.setContent(
                `<div>Error uploading file: ${error.message}</div>`,
              );
              editorInstance.Modal.open();
            }
          },
          // Define initial assets (optional)
          assets: [
            "https://via.placeholder.com/350x250/78c5d6/fff/image1.jpg",
            "https://via.placeholder.com/350x250/459ba8/fff/image2.jpg",
            {
              type: "image",
              src: "https://via.placeholder.com/350x250/794F9B/fff/image3.jpg",
              height: 350,
              width: 250,
            },
          ],
        },
        // --- Canvas settings (keep Bootstrap included) ---
        canvas: {
          styles: [
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css", // Use latest Bootstrap 5
          ],
          scripts: [
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js", // Use latest Bootstrap 5
          ],
        },
      });
      // Add basic elements
      Object.entries(basicElements).forEach(([key, element]) => {
        editorInstance.BlockManager.add(key, element);
      });

      // Add layout elements
      Object.entries(layoutElements).forEach(([key, element]) => {
        editorInstance.BlockManager.add(key, element);
      });

      // Add e-commerce sections
      Object.entries(heroSections).forEach(([key, section]) => {
        editorInstance.BlockManager.add(`hero-${key}`, section);
      });

      Object.entries(productSections).forEach(([key, section]) => {
        editorInstance.BlockManager.add(`product-${key}`, section);
      });

      // --- FINALIZE ---
      setEditor(editorInstance);
      window.editorInstance = editorInstance; // Keep for debugging
      console.log(
        "GrapesJS Editor Initialized with more blocks and Asset Manager configured.",
      );
    }

    // Cleanup
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
        console.log("GrapesJS Editor Destroyed");
      }
    };
  }, []); // Empty dependency array

  // --- Interaction Functions (Save/Load etc. - same as before) ---
  const getHtmlCss = () => {
    /* ... */
  };
  const getProjectData = () => {
    /* ... */
  };
  const loadProjectData = () => {
    /* ... */
  };

  return (
    <div>
      <div ref={editorContainerRef} id="gjs"></div>
    </div>
  );
}

export default GrapesJsEditor;
