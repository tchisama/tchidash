import { initAdmin } from "@/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const COLLECTION_NAME = "products";

export async function GET(request: NextRequest) {
  await initAdmin();

  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id");

  try {
    const firestore = getFirestore();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const doc = await firestore.collection(COLLECTION_NAME).doc(id).get();
    const product = {
      ...doc.data(),
      id: doc.id,
    };

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
