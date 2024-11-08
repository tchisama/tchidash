import { db } from "@/firebase";
import {
  addDoc,
  AggregateSpec,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getAggregateFromServer,
  getDoc,
  getDocs,
  Query,
  setDoc,
  UpdateData,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore";
import { trackUserUsage } from "../queries/usage";

const dbDoc = (col: string, id: string) => doc(db, col, id);

async function dbSetDoc<AppModelType, DbModelType extends DocumentData>(
  reference: DocumentReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>,
  storeId: string,
  userEmail: string,
) {
  const docRef = await setDoc(reference, data);
  trackUserUsage({
    userEmail: userEmail,
    storeId: storeId,
    action: "upload",
    data: data,
    clctn: reference.parent.id,
    endpoint: reference.id,
  });
  return docRef;
}

async function dbAddDoc<AppModelType, DbModelType extends DocumentData>(
  reference: CollectionReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>,
  storeId: string,
  userEmail: string,
) {
  const docRef = await addDoc(reference, data);
  trackUserUsage({
    userEmail: userEmail,
    storeId: storeId,
    action: "upload",
    data: data,
    clctn: reference.id,
    endpoint: docRef.id,
  });
  return docRef;
}

async function dbGetDoc<AppModelType, DbModelType extends DocumentData>(
  ref: DocumentReference<AppModelType, DbModelType>,
  storeId: string,
  userEmail: string,
) {
  const doc = await getDoc(ref);
  trackUserUsage({
    userEmail: userEmail,
    storeId: storeId,
    action: "download",
    data: doc.data(),
    clctn: ref.parent.id,
    endpoint: ref.id,
  });
  return doc.data();
}

async function dbGetDocs<AppModelType, DbModelType extends DocumentData>(
  query: Query<AppModelType, DbModelType>,
  storeId: string,
  userEmail: string,
) {
  const docs = await getDocs(query);
  docs.forEach((doc) => {
    trackUserUsage({
      userEmail: userEmail,
      storeId: storeId,
      action: "download",
      data: doc.data(),
      clctn: doc.ref.parent.id,
      endpoint: doc.ref.id,
    });
  });
  return docs;
}

async function dbDeleteDoc<AppModelType, DbModelType extends DocumentData>(
  reference: DocumentReference<AppModelType, DbModelType>,
  storeId: string,
  userEmail: string,
) {
  await deleteDoc(reference);
  trackUserUsage({
    userEmail: userEmail,
    storeId: storeId,
    action: "delete",
    data: null,
    clctn: reference.parent.id,
    endpoint: reference.id,
  });
}

async function dbUpdateDoc<AppModelType, DbModelType extends DocumentData>(
  reference: DocumentReference<AppModelType, DbModelType>,
  data: UpdateData<DbModelType>,
  storeId: string,
  userEmail: string,
) {
  const docRef = await updateDoc(reference, data)
  trackUserUsage({
    userEmail: userEmail,
    storeId: storeId,
    action: "upload",
    data: data,
    clctn: reference.parent.id,
    endpoint: reference.id,
  });
  return docRef;
}

async function dbGetAggregateFromServer<
  AggregateSpecType extends AggregateSpec,
  AppModelType,
  DbModelType extends DocumentData,
>(
  query: Query<AppModelType, DbModelType>,
  aggregateSpec: AggregateSpecType,
  storeId: string,
  userEmail: string,
) {
  const res = await getAggregateFromServer(query, aggregateSpec);
  trackUserUsage({
    userEmail: userEmail,
    storeId: storeId,
    action: "download",
    data: res,
    clctn: "aggregate",
    endpoint: "aggregate",
  });
  return res;
}

export {
  dbDoc,
  dbGetDoc,
  dbSetDoc,
  dbGetDocs,
  dbAddDoc,
  dbDeleteDoc,
  dbUpdateDoc,
  dbGetAggregateFromServer,
};
