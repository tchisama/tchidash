import { 
  query, 
  Query,
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  getCountFromServer,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';

interface PaginationResult {
  documents: DocumentData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export async function getPage(
  baseQuery: Query<DocumentData>,
  pageNumber: number,
  pageSize: number,
  orderByField: string = 'createdAt'
): Promise<PaginationResult> {
  // Get total count of documents
  const snapshot = await getCountFromServer(baseQuery);
  const totalCount = snapshot.data().count;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Ensure requested page number is valid
  if (pageNumber < 1 || pageNumber > totalPages) {
    throw new Error('Invalid page number');
  }

  // Calculate how many documents to skip
  const documentsToSkip = (pageNumber - 1) * pageSize;

  // Create the initial query with ordering and limit
  const queryConstraints: QueryConstraint[] = [
    orderBy(orderByField, 'desc'),
    limit(pageSize)
  ];

  // If it's not the first page, we need to use startAfter
  if (documentsToSkip > 0) {
    // Get the document to start after
    const snapshot = await getDocs(query(baseQuery, orderBy(orderByField, 'desc'), limit(documentsToSkip)));
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    
    // Add startAfter to the query constraints
    queryConstraints.push(startAfter(lastVisibleDoc));
  }

  // Execute the query
  const finalQuery = query(baseQuery, ...queryConstraints);
  const querySnapshot = await getDocs(finalQuery);

  // Convert the query snapshot to an array of documents
  const documents = querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }));

  return {
    documents,
    currentPage: pageNumber,
    totalPages,
    pageSize
  };
}