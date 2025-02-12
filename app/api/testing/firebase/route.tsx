import { initAdmin } from "@/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  await initAdmin();
  try {
    const firestore = getFirestore();
    const products = await firestore.collection("products").get();
    const docs = products.docs.map((doc) => doc.data());
    return NextResponse.json({
      products: docs,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
