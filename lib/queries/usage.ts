import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase"; // Assuming you're using Firestore
import { Usage } from "@/types/usage"; // Assuming Usage type is already created
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

// Function to auto-upload usage with minimal input
export const trackUserUsage = async ({
  userEmail,
  storeId,
  action,
  data,
  clctn,
  endpoint,
}: {
  userEmail: string;
  storeId: string;
  action: "upload" | "download" | "delete";
  data: unknown;
  clctn: string;
  endpoint: string;
}): Promise<void> => {
  try {
    // Create a usage record with the important fields and auto-fill the rest
    const dataAmount = JSON.stringify(data).length; // Calculate data size in bytes
    const usageRecord: Usage = {
      id: uuidv4(), // Generate unique ID
      userEmail: userEmail,
      storeId: storeId || "default_store", // Optional, default store if not provided
      action: action,
      endpoint: endpoint, // API endpoint used
      dataAmount: dataAmount, // Data amount in bytes
      createdAt: Timestamp.now(), // When the record is created
      collection: clctn || "other", // Default to "other" if not provided
    };

    const ref = doc(
      db,
      "usage",
      String(
        storeId +
          "__" +
          action +
          "__" +
          Timestamp.now().toDate().toLocaleDateString().replaceAll("/", "-"),
      ),
    );

    let dataUsage = 0;
    await getDoc(ref).then((doc) => {
      if (doc.exists()) {
        dataUsage = doc.data().dataAmount;
      }
    });
    console.log("Data usage:", dataUsage);
    console.log("Data amount:", dataAmount);

    // Add the usage record to the "usage" collection in Firestore
    await setDoc(
      ref,
      {
        ...usageRecord,
        dataAmount: dataUsage + dataAmount,
      },
      { merge: true },
    );
    console.log("Usage record successfully uploaded:");
  } catch (error) {
    console.error("Error uploading usage record:", error);
  }
};
