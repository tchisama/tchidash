import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { regions } from "@/lib/datajson/moroccan-regions";

const MoroccoMap = () => {
  // Track hovered region
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>("MA-08");

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
            width="400"
            height="400"
            className=" drop-shadow-[0px_20px_10px_#3331] p-3 rounded-2xl"
            viewBox="0 0 612.51373 654.53473"
          >
            {
              // Render each region
              regions &&
                regions.map((region: { id: string; d: string }) => (
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
        <div>
          <h1 className="text-3xl">
            {regions &&
              regions.find(
                (p: { id: string; title: string; d: string }) =>
                  p.id === selectedRegion,
              )?.title}
          </h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoroccoMap;
