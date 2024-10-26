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
import { cn } from "@/lib/utils";

const MoroccoMap = () => {
  // Track hovered region
  const [selectedRegion, setSelectedRegion] = useState<string | null>("MA-01");
  const { storeId } = useStore();

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
      <CardContent className="flex gap-8 ">
        <div className=" w-fit flex-1 rounded-2xl border relative from-primary/20 to-primary/10 bg-gradient-to-t">
          <h3 className="text-md absolute top-3 left-3 text-muted-foreground">
            {selectedRegion}
          </h3>
          <h1 className="text-xl font-bold absolute top-8 left-3 text-muted-foreground">
            {regions && regions.find((p) => p.id === selectedRegion)?.title}
          </h1>

          <h3 className="text-9xl font-bold absolute bottom-4 right-6 text-primary">
            {data?.toString()}
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="450"
            className=" w-full drop-shadow-[0px_20px_10px_#3331] p-3 rounded-2xl"
            viewBox="0 0 612.51373 654.53473"
          >
            {
              // Render each region
              regions &&
                [
                  ...regions.filter((region) => region.id !== selectedRegion),
                  ...regions.filter((region) => region.id == selectedRegion),
                ].map((region) => (
                  <g
                    key={region.id}
                    className={cn(
                      region.id == selectedRegion &&
                        "drop-shadow-[10px_20px_30px_#7c3aeda3] duration-300",
                    )}
                    //transform={
                    //  "translate(" +
                    //  (selectedRegion === region.id ? "5,-5" : "0,0") +
                    //  ")"
                    //}
                  >
                    <path
                      className={cn(
                        "duration-300 cursor-pointer fill-white hover:fill-primary/20 ",
                        selectedRegion === region.id
                          ? "fill-primary/80 hover:fill-primary"
                          : "",
                      )}
                      key={region.id}
                      stroke={selectedRegion === region.id ? "white" : "#3333"}
                      strokeWidth={selectedRegion === region.id ? 2 : 1}
                      d={region.d}
                      onClick={() => setSelectedRegion(region.id)}
                      //style={regionStyle(region.id)}
                      id={region.id}
                    />
                  </g>
                ))
            }
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

//<div className="flex flex-1 flex-col ">
//  <h3 className="text-lg ">{selectedRegion}</h3>
//  <h1 className="text-xl ">
//    {regions && regions.find((p) => p.id === selectedRegion)?.title}
//  </h1>
//  <h3 className="text-8xl  font-bold">{data?.toString()}</h3>
//</div>

export default MoroccoMap;
