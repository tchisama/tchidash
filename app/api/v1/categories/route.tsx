import { initAdmin } from "@/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const COLLECTION_NAME = "categories";

export async function GET(request: NextRequest) {
  await initAdmin();

  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get("storeid");
  const status = searchParams.get("status");

  if (!storeId) {
    return NextResponse.json({ error: "storeid is required" }, { status: 400 });
  }

  try {
    const firestore = getFirestore();
    let query = firestore.collection(COLLECTION_NAME).where("storeId", "==", storeId);

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ categories });
  } catch  {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await initAdmin();

  try {
    const body = await request.json();
    const { name, description, status = "active", storeId } = body;

    if (!storeId || !name) {
      return NextResponse.json(
        { error: "storeId and name are required" },
        { status: 400 }
      );
    }

    const firestore = getFirestore();
    const docRef = await firestore.collection(COLLECTION_NAME).add({
      name,
      description,
      status,
      storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: docRef.id,
      name,
      description,
      status,
      storeId,
    });
  } catch  {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await initAdmin();

  try {
    const body = await request.json();
    const { id, name, description, status, storeId } = body;

    if (!id || !storeId) {
      return NextResponse.json(
        { error: "id and storeId are required" },
        { status: 400 }
      );
    }

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

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    await docRef.update(updateData);

    return NextResponse.json({
      message: "Category updated",
      id,
      ...updateData,
    });
  } catch  {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    await docRef.delete();

    return NextResponse.json({
      message: "Category deleted",
      id,
    });
  } catch  {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
} 