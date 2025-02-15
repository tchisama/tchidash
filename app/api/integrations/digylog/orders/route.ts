import { db } from "@/firebase";
import { dbGetDoc } from "@/lib/dbFuntions/fbFuns";
import { digylogIntegration, Store } from "@/types/store";
import axios from "axios";
import { doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const DIGYLOG_BASE_URL = "https://api.digylog.com/api/v2/seller";
export const DIGYLOG_REFERER = "https://apiseller.digylog.com";

// GET ORDER INFO
export async function GET(request: NextRequest) {
  // get it from /order/:traking/info
  //
  const storeId = request.nextUrl.searchParams.get("storeId");
  const traking = request.nextUrl.searchParams.get("traking");

  if (!storeId) {
    return NextResponse.json({ status: "no storeId" });
  }
  if (!traking) {
    return NextResponse.json({ status: "no traking" });
  }

  const { token, errors } = await getDigylogCredantials(storeId);

  console.log("get order info", token, storeId, traking, errors);

  if (errors) {
    return NextResponse.json({ status: errors });
  }

  try {
    const response = await axios
      .get(`${DIGYLOG_BASE_URL}/order/${traking}/infos`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer: DIGYLOG_REFERER,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return NextResponse.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error sending data to Digylog");
    console.log(JSON.stringify(error, null, 2));
    return NextResponse.json({ status: error }, { status: 500 });
  }
}

// CREATE NEW ORDER

export async function POST(request: NextRequest) {
  const body = await request.json();

  const storeId = request.nextUrl.searchParams.get("storeId");
  console.log(storeId);

  if (!storeId) {
    return NextResponse.json({ status: "no storeId" });
  }

  const { token, store, network, errors } =
    await getDigylogCredantials(storeId);

  if (errors) {
    return NextResponse.json({ status: errors });
  }

  try {
    const { mode, status, orders } = body;
    console.log(token, store, network, mode, status, orders);

    const response = await axios
      .post(
        `${DIGYLOG_BASE_URL}/orders`,
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
            Referer: DIGYLOG_REFERER,
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => res.data);

    return NextResponse.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error sending data to Digylog");
    console.log(JSON.stringify(error, null, 2));
    return NextResponse.json({ status: error }, { status: 500 });
  }
}

export async function getDigylogCredantials(storeId: string) {
  if (!storeId) {
    return { token: "", store: "", network: "", errors: "no storeId" };
  }
  const currentStore = (await dbGetDoc(
    doc(db, "stores", storeId),
    storeId,
    "",
  )) as Store;

  if (!currentStore) {
    return { token: "", store: "", network: "", errors: "no store" };
  }
  if (!currentStore.integrations) {
    return { token: "", store: "", network: "", errors: "no integrations" };
  }
  if (
    !currentStore.integrations.find(
      (i: { name: string }) => i.name === "digylog",
    )?.enabled
  ) {
    return { token: "", store: "", network: "", errors: "digylog not enabled" };
  }
  const { token, store, network } = currentStore.integrations.find(
    (i: { name: string }) => i.name === "digylog",
  ) as digylogIntegration;

  if (!token) {
    return { token: "", store, network, errors: "no token" };
  }
  if (!store) {
    return { token, store: "", network, errors: "no store" };
  }
  if (!network) {
    return { token, store, network: "", errors: "no network" };
  }

  return { token, store, network, errors: "" };
}
