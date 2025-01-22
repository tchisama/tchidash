import { db } from "@/firebase";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import type { Notification } from "@/types/notification";



const createNotification = async (notification: Notification) => {
  const docRef = await addDoc(collection(db, "notifications"), notification);
  console.log("Document written with ID: ", docRef.id);
}


const markNotificationAsRead = async (id: string, email: string) => {
  const notificationRef = doc(db, "notifications", id);

  await updateDoc(notificationRef, {
    seen: arrayUnion(email),
  });
}


export { createNotification , markNotificationAsRead };