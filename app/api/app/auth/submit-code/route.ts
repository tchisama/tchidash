import { db } from "@/firebase";
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  console.log("email", email);

  const q = query(collection(db, "users"), where("email", "==", email));
  const user = await getDocs(q);

  if (user.empty) {
    //return { status: 404, body: { message: "User not found" } };
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // remove all the auth subscribers with the same email
  const q2 = query(
    collection(db, "auth-subscribers"),
    and(where("email", "==", email), where("approved", "==", false)),
  );
  const authSubscribers = await getDocs(q2);
  authSubscribers.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  const code = Math.floor(100000 + Math.random() * 900000);

  addDoc(collection(db, "auth-subscribers"), {
    email,
    approved: false,
    createdAt: Timestamp.now(),
    code,
  });

  // return the response code
  //return { status: 200, body: { code } };
  return NextResponse.json({ code });
}
