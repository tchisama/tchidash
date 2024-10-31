import { NextRequest, NextResponse } from "next/server";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.5",
  Authorization:
    "Bearer Y2QxMjUyZjdmMjg2N2IyZDc4Y2FhODhkOGNlZjdlMTdmMmZhNjZiMDIyZDIxODE5NjNjNmI3NWU2OWJhMDBiZA",
  "Content-Type": "application/json",
};

const historicOrderUrl =
  "https://api.digylog.com/api/seller/v31/historic/orders";

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId");
  const phone = request.nextUrl.searchParams.get("phone");
  const trakingId = request.nextUrl.searchParams.get("trakingId");

  if (!phone) {
    return NextResponse.json({ status: "error" });
  }

  const params = new URLSearchParams({
    phone,
    datetype: 1,
    countPerPage: 10,
    currentPage: 1,
    sort: 1,
    sortFiled: "createdAt",
    sortDir: -1,
  } as unknown as Record<string, string>);

  try {
    const response = await fetch(`${historicOrderUrl}?${params}`, {
      headers,
    });
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch {
    console.error("Error fetching data from Digylog");
    return NextResponse.json({ status: "error" });
  }
}
