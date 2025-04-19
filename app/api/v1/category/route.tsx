import { initAdmin } from "@/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const COLLECTION_NAME = "categories";

export async function GET(request: NextRequest) {
  await initAdmin();

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const storeId = searchParams.get("storeid");

  if (!id || !storeId) {
    return NextResponse.json(
      { error: "id and storeid are required" },
      { status: 400 }
    );
  }

  try {
    const firestore = getFirestore();
    const docRef = firestore.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (doc.data()?.storeId !== storeId) {
      return NextResponse.json(
        { error: "Unauthorized access to category" },
        { status: 403 }
      );
    }

    const category = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json({ category });
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
} 