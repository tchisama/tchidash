import { db } from "@/firebase";
import { dbGetDoc } from "@/lib/dbFuntions/fbFuns";
import { digylogIntegration, Store } from "@/types/store";
import axios from "axios";
import { doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // const storeId = request.nextUrl.searchParams.get("storeId");
  // const traking = request.nextUrl.searchParams.get("traking");
  // const phone = request.nextUrl.searchParams.get("phone");
  //
  // if (!storeId) {
  //   return NextResponse.json({ status: "no storeId" });
  // }
  // const store = (await dbGetDoc(
  //   doc(db, "stores", storeId),
  //   storeId,
  //   "",
  // )) as Store;
  //
  // if (!store) {
  //   return NextResponse.json({ status: "no store by that id" });
  // }
  // if (!store.integrations) {
  //   return NextResponse.json({ status: "no integrations" });
  // }
  // if (
  //   !store.integrations.find((i: { name: string }) => i.name === "digylog")
  //     ?.enabled
  // ) {
  //   return NextResponse.json({ status: "integration not enabled" });
  // }
  // const { headers: hdrs } = store.integrations.find(
  //   (i: { name: string }) => i.name === "digylog",
  // ) as digylogIntegration;
  //
  // const authorization = hdrs.authorization;
  //
  // if (!authorization) {
  //   return NextResponse.json({ status: "no authorization" });
  // }
}

// CREATE NEW ORDER

const baseUrl = "https://api.digylog.com/api/v2/seller";
const referer = "https://apiseller.digylog.com";
const bearerToken =
  "YTk2MDA3Mzc0NjQyZjQxNmI2MjI4ZDQ1MTI0OGJjYjk4YWM1NjcxMGE2NTAyNDc5ODFiOWZjYWMzNjcwNjcyOQ";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const { network, store, mode, status, orders } = body;

    const response = await axios
      .post(
        `${baseUrl}/orders`,
        {
          network,
          store,
          mode,
          status,
          orders,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: referer,
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      )
      .then((res) => res.data);

    return NextResponse.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error sending data to Digylog");
    return NextResponse.json({ status: error }, { status: 500 });
  }
}
