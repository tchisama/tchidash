import {
  getFirestore,
  Query,
  QuerySnapshot,
  DocumentData,
} from "firebase-admin/firestore";

interface QueryOptions {
  filters?: {
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: unknown;
  }[];
  searchField?: string;
  searchValue?: unknown;
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  startAfter?: string;
}

export async function fetchFirestoreDocs(
  collectionName: string,
  docStructure: Record<string, unknown>,
  options: QueryOptions = {},
): Promise<DocumentData[]> {
  const db = getFirestore();
  let query: Query = db.collection(collectionName);

  const {
    filters = [],
    searchField,
    searchValue,
    limit,
    orderBy,
    orderDirection = "asc",
    startAfter,
  } = options;

  // ✅ Apply filters dynamically, ensuring they exist in docStructure
  filters.forEach(({ field, operator, value }) => {
    if (docStructure[field]) {
      query = query.where(field, operator, value);
    }
  });

  // ✅ Apply search (supports both string and array-contains search)
  if (searchField && searchValue && docStructure[searchField]) {
    query = query.where(
      searchField,
      Array.isArray(searchValue) ? "array-contains" : "==",
      searchValue,
    );
  }

  // ✅ Apply sorting
  if (orderBy && docStructure[orderBy]) {
    query = query.orderBy(orderBy, orderDirection);
  }

  // ✅ Apply pagination
  if (startAfter) {
    const startAfterDoc = await db
      .collection(collectionName)
      .doc(startAfter)
      .get();
    if (startAfterDoc.exists) {
      query = query.startAfter(startAfterDoc);
    }
  }

  // ✅ Apply limit
  if (limit) {
    query = query.limit(limit);
  }

  // ✅ Execute query and return results
  const snapshot: QuerySnapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
