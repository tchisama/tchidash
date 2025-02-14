import { initAdmin } from "@/firebaseAdmin";
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
  options: QueryOptions = {},
): Promise<DocumentData[]> {
  await initAdmin();
  const firestore = getFirestore();
  let query: Query = firestore.collection(collectionName);

  const {
    filters = [],
    searchField,
    searchValue,
    limit,
    // orderBy,
    // orderDirection = "asc",
    startAfter,
  } = options;

  // ✅ Apply filters dynamically, ensuring they exist in docStructure
  filters.forEach(({ field, operator, value }) => {
    query = query.where(field, operator, value);
  });

  // ✅ Apply search (supports both string and array-contains search)
  if (searchField && searchValue) {
    query = query
      .where("title", ">=", searchValue)
      .where("title", "<", searchValue + "\uf8ff");
  }

  // ✅ Apply sorting
  // if (orderBy) {
  //   query = query.orderBy(orderBy, orderDirection);
  // }

  // ✅ Apply pagination
  if (startAfter) {
    const startAfterDoc = await firestore
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

export function generateFilterOptions(docStructure: Record<string, unknown>) {
  const filters = Object.entries(docStructure).map(([field, type]) => {
    let operators: string[] = [];

    switch (type) {
      case "string":
        operators = ["=="]; // Exact match only
        break;
      case "number":
        operators = ["==", "!=", ">", "<", ">=", "<="]; // Numeric comparisons
        break;
      case "boolean":
        operators = ["=="]; // True or false
        break;
      case "array":
        operators = ["array-contains"]; // Checking if an array contains a value
        break;
      case "date":
      case "timestamp":
        operators = ["==", ">", "<", ">=", "<="]; // Date comparisons
        break;
      default:
        operators = ["=="]; // Default fallback
    }

    return {
      name: field,
      operators,
    };
  });

  return { filters };
}
