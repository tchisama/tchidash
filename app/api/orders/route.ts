import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust this import based on your Firebase setup
import { Order } from '@/types/order';





export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
  }

  try {
    const data = await getDocs(query(collection(db, "orders"), 
      where("storeId", "==", storeId)
    )).then((response) => response.docs.map((doc) => ({...doc.data(), id: doc.id} as Order)));
    return NextResponse.json({
      storeId,
      data,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}






export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  // create New Order
  const body = await request.json();
  const order = {
    ...body,
    storeId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  if(!order.customer.firstName) return NextResponse.json({ error: 'Please enter the first name' }, { status: 400 });
  if(!order.customer.lastName) return NextResponse.json({ error: 'Please enter the last name' }, { status: 400 });
  if(!order.customer.phoneNumber) return NextResponse.json({ error: 'Please enter the phone number' }, { status: 400 });
  if(!order.customer.shippingAddress.address) return NextResponse.json({ error: 'Please enter the shipping address' }, { status: 400 });
  if(!order.customer.shippingAddress.city) return NextResponse.json({ error: 'Please enter the shipping city' }, { status: 400 });
  if(!order.items.length) return NextResponse.json({ error: 'Please add at least one item' }, { status: 400 });


  const createdOrder = await addDoc(collection(db, "orders"), order).then((response) => response.id);

  if(!createdOrder) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
  return NextResponse.json({
    createdOrder
  });
}