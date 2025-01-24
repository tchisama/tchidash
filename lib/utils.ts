import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



// lib/utils.js

export const copyToClipboard = (text:string) => {
  // Check if the Clipboard API is available
  if (navigator.clipboard) {
    // Use the modern Clipboard API
    return navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard successfully!');
      })
      .catch((err) => {
        console.error('Failed to copy text to clipboard:', err);
      });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('Text copied to clipboard successfully!');
      } else {
        console.error('Failed to copy text to clipboard.');
      }
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
};