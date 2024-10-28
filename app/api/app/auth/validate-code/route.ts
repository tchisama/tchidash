import { db } from "@/firebase";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code, email } = await req.json();

  const q = query(
    collection(db, "auth-subscribers"),
    and(
      where("email", "==", email),
      where("code", "==", code),
      where("approved", "==", true),
    ),
  );

  return getDocs(q).then((snapshot) => {
    const storeId = snapshot.docs[0].data().storeId;
    if (snapshot.empty) {
      return NextResponse.json({ message: "Invalid code" }, { status: 404 });
    } else {
      return NextResponse.json({ storeId });
    }
  });
}
