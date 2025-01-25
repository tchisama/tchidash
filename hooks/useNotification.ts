


import { useSession } from 'next-auth/react';
import { Timestamp } from 'firebase/firestore'; // Assuming you're using Firebase Firestore
import { createNotification } from '@/lib/utils/functions/notifications';
import { useStore } from '@/store/storeInfos';

const useNotification = () => {
  const { data: session } = useSession();
  const { storeId , store } = useStore();

  const sendNotification = (action: string, target: string) => {
    if (!storeId || !session?.user) {
      console.error("Store ID or user session is missing.");
      return;
    }
    if(!store) return;
    if(!store.employees) return;
    if(!(session.user && session.user.email)) return;
    // get user name
    const notification = {
      storeId,
      email: session.user.email ?? "",
      action,
      target,
      id: "", // You can generate an ID here if needed
      createdAt: Timestamp.now(),
      seen: [],
    };

    createNotification(notification);
  };

  return { sendNotification };
};

export default useNotification;