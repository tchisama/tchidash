


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
    const employee = store?.employees?.find(employee => employee.email === session.user?.email);
    const name = employee?.name
    const image = employee?.imageUrl
    const notification = {
      storeId,
      user: name ?? session.user.name ?? "",
      email: session.user.email ?? "",
      action,
      target,
      image: image ?? session.user.image ?? "",
      id: "", // You can generate an ID here if needed
      createdAt: Timestamp.now(),
      seen: [],
    };

    createNotification(notification);
  };

  return { sendNotification };
};

export default useNotification;