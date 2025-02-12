import { initAdmin } from "@/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const COLLECTION_NAME = "products";

export async function GET(request: NextRequest) {
  await initAdmin();

  const searchParams = request.nextUrl.searchParams;

  const storeId = searchParams.get("storeid");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const limit = searchParams.get("limit");
  const status = searchParams.get("status");

  try {
    const firestore = getFirestore();

    let query = firestore
      .collection(COLLECTION_NAME)
      .where("status", "!=", "deleted")
      .where("storeId", "==", storeId);

    if (category) {
      query = query.where("category", "==", category);
    }
    if (minPrice) {
      query = query.where("price", ">=", parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.where("price", "<=", parseFloat(maxPrice));
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await initAdmin();
  try {
    const firestore = getFirestore();
    const data = await req.json();
    const docRef = await firestore.collection(COLLECTION_NAME).add(data);

    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await initAdmin();
  try {
    const firestore = getFirestore();
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await firestore.collection(COLLECTION_NAME).doc(id).update(data);
    return NextResponse.json({ message: "Product updated", id });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await initAdmin();
  try {
    const firestore = getFirestore();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await firestore.collection(COLLECTION_NAME).doc(id).delete();
    return NextResponse.json({ message: "Product deleted", id });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
