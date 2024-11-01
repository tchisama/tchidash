import { db } from "@/firebase";
import { dbGetDoc } from "@/lib/dbFuntions/fbFuns";
import { digylogIntegration, Store } from "@/types/store";
import { doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// new start
const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.5",
  Authorization: "",
  "Content-Type": "application/json",
};

const historicOrderUrl =
  "https://api.digylog.com/api/seller/v31/historic/orders";

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId");
  const traking = request.nextUrl.searchParams.get("traking");
  const phone = request.nextUrl.searchParams.get("phone");

  if (!storeId) {
    return NextResponse.json({ status: "no storeId" });
  }
  const store = (await dbGetDoc(
    doc(db, "stores", storeId),
    storeId,
    "",
  )) as Store;

  if (!store) {
    return NextResponse.json({ status: "no store by that id" });
  }
  if (!store.integrations) {
    return NextResponse.json({ status: "no integrations" });
  }
  if (
    !store.integrations.find((i: { name: string }) => i.name === "digylog")
      ?.enabled
  ) {
    return NextResponse.json({ status: "integration not enabled" });
  }
  const { headers: hdrs } = store.integrations.find(
    (i: { name: string }) => i.name === "digylog",
  ) as digylogIntegration;

  const authorization = hdrs.authorization;

  if (!authorization) {
    return NextResponse.json({ status: "no authorization" });
  }

  const params = new URLSearchParams({
    datetype: 1,
    countPerPage: 10,
    currentPage: 1,
    sort: 1,
    sortFiled: "createdAt",
    sortDir: -1,
  } as unknown as Record<string, string>);

  if (traking) {
    params.append("traking", traking);
  } else if (phone) {
    params.append("phone", phone);
  } else {
    return NextResponse.json({ status: "no traking and no number" });
  }

  try {
    const response = await fetch(`${historicOrderUrl}?${params}`, {
      headers: {
        ...headers,
        Authorization: authorization,
      },
    });
    const responseData = await response.json();
    console.log("Data fetched from Digylog", responseData);
    return NextResponse.json(responseData);
  } catch {
    console.error("Error fetching data from Digylog");
    return NextResponse.json({ status: "error" });
  }
}

export async function POST(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId");
  const body = await request.json();
  if (!storeId) {
    return NextResponse.json({ status: "no storeId" });
  }
  const store = (await dbGetDoc(
    doc(db, "stores", storeId),
    storeId,
    "",
  )) as Store;

  if (!store) {
    return NextResponse.json({ status: "no store by that id" });
  }
  if (!store.integrations) {
    return NextResponse.json({ status: "no integrations" });
  }
  if (
    !store.integrations.find((i: { name: string }) => i.name === "digylog")
      ?.enabled
  ) {
    return NextResponse.json({ status: "integration not enabled" });
  }
  const { headers: hdrs } = store.integrations.find(
    (i: { name: string }) => i.name === "digylog",
  ) as digylogIntegration;

  const authorization = hdrs.authorization;

  if (!authorization) {
    return NextResponse.json({ status: "no authorization" });
  }

  try {
    const url = "https://api.digylog.com/api/seller/v31/orders";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    return NextResponse.json({ status: "success", data: responseData });
  } catch {
    console.error("Error sending data to Digylog");
    return NextResponse.json({ status: "error" });
  }
}
