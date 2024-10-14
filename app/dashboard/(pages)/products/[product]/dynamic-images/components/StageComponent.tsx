"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
} from "react-konva";

function StageComponent() {
  return (
    <Stage
      width={500}
      height={500}
      className="w-[500px] bg-slate-100 h-[500px] border rounded-2xl overflow-hidden"
    >
      <Layer>
        <Rect x={20} y={20} width={100} height={100} fill="red" draggable />
        <URLImage
          src="https://www.cactusia.ma/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fcactusia-983c2.appspot.com%2Fo%2Fpots%252F1707510683964%3Falt%3Dmedia%26token%3Dbb288d03-287d-45f0-8b90-f9871f1a7567&w=256&q=75"
          x={100}
          y={100}
        />
        <Rect x={300} y={300} width={100} height={100} fill="blue" draggable />
      </Layer>
    </Stage>
  );
}

const URLImage = ({ src, x, y }: { src: string; x: number; y: number }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageNode = useRef(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.addEventListener("load", handleLoad);

    // Cleanup on unmount
    return () => {
      img.removeEventListener("load", handleLoad);
    };

    function handleLoad() {
      setImage(img);
      // If you need to manually update the layer:
      // if (imageNode.current) {
      //   imageNode.current.getLayer().batchDraw();
      // }
    }
  }, [src]);

  const getContainDimensions = (
    imgWidth: number,
    imgHeight: number,
    maxWidth: number,
    maxHeight: number,
  ) => {
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = maxWidth / maxHeight;

    if (imgRatio > containerRatio) {
      return {
        width: maxWidth,
        height: maxWidth / imgRatio,
      };
    } else {
      return {
        width: maxHeight * imgRatio,
        height: maxHeight,
      };
    }
  };

  return (
    image && (
      <KonvaImage
        draggable
        {...getContainDimensions(
          image?.width as number,
          image?.height as number,
          300,
          300,
        )} // Here we apply the 'contain' logic
        x={x}
        y={y}
        image={image}
        alt=""
        ref={imageNode}
      />
    )
  );
};

export default StageComponent;
