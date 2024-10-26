import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { useStore } from "@/store/storeInfos";
import { collection, count, query, where } from "firebase/firestore";
import { dbGetAggregateFromServer } from "@/lib/dbFuntions/fbFuns";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { regions } from "@/lib/datajson/moroccan-regions-full";

const MoroccoMap = () => {
  // Track hovered region
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>("MA-01");
  const { storeId } = useStore();

  // Event handlers
  const handleMouseEnter = (id: string) => setHoveredRegion(id);
  const handleMouseLeave = () => setHoveredRegion(null);

  // Common styles for regions
  const regionStyle = (id: string) => ({
    fill:
      hoveredRegion === id
        ? "#7c3aed22"
        : selectedRegion == id
          ? "#7c3aed"
          : "white", // Change color on hover
    cursor: "pointer",
  });

  const { data, error } = useQuery({
    queryKey: ["ordersByRegion", selectedRegion, storeId],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where(`cityAi.ID`, "==", selectedRegion),
      );
      if (!storeId) return 0;
      const snapshot = await dbGetAggregateFromServer(
        q,
        {
          count: count(),
        },
        storeId,
        "",
      );
      return snapshot.data().count;
    },
  });
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Top Cities by Orders</CardTitle>
        <CardDescription>
          Explore the cities with the highest order activity to gain insights on
          regional demand.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-8">
        <div className="bg-slate-50 w-fit rounded-2xl border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="450"
            className=" drop-shadow-[0px_20px_10px_#3331] p-3 rounded-2xl"
            viewBox="0 0 612.51373 654.53473"
          >
            {
              // Render each region
              regions &&
                regions.map((region) => (
                  <path
                    className="duration-300"
                    key={region.id}
                    stroke="#3333"
                    strokeWidth={1}
                    d={region.d}
                    onClick={() => setSelectedRegion(region.id)}
                    style={regionStyle(region.id)}
                    onMouseEnter={() => handleMouseEnter(region.id)}
                    onMouseLeave={handleMouseLeave}
                    id={region.id}
                  />
                ))
            }
          </svg>
        </div>
        <div className="flex flex-1 flex-col ">
          <h3 className="text-lg ">{selectedRegion}</h3>
          <h1 className="text-xl ">
            {regions && regions.find((p) => p.id === selectedRegion)?.title}
          </h1>
          <h3 className="text-8xl  font-bold">{data?.toString()}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoroccoMap;
