import { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebase';

export async function getPage( collectionName: string, pageNumber:number, pageSize: number) {
  const collectionRef = collection(db, collectionName);
  
  // Get total count of documents
  const snapshot = await getCountFromServer(collectionRef);
  const totalCount = snapshot.data().count;
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Ensure requested page number is valid
  if (pageNumber < 1 || pageNumber > totalPages) {
    throw new Error('Invalid page number');
  }
  
  // Calculate how many documents to skip
  const documentsToSkip = (pageNumber - 1) * pageSize;
  
  // Create the initial query
  let q = query(collectionRef, orderBy('createdAt'), limit(pageSize));
  
  // If it's not the first page, we need to use startAfter
  if (documentsToSkip > 0) {
    // Get the document to start after
    const snapshot = await getDocs(query(collectionRef, orderBy('createdAt'), limit(documentsToSkip)));
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    
    // Update the query to start after this document
    q = query(collectionRef, orderBy('createdAt'), startAfter(lastVisibleDoc), limit(pageSize));
  }
  
  // Execute the query
  const querySnapshot = await getDocs(q);
  
  // Convert the query snapshot to an array of documents
  const documents = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return {
    documents,
    currentPage: pageNumber,
    totalPages,
    pageSize
  };
}
