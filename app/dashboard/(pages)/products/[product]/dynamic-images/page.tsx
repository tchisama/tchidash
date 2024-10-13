"use client";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";

function page() {
  return (
    <div>
      <Stage
        width={500}
        height={500}
        className="bg-white w-[500px] h-[500px] border rounded-2xl overflow-hidden"
      >
        <Layer>
          <Rect x={20} y={20} width={100} height={100} fill="red" draggable />
          <Rect x={150} y={150} width={100} height={100} fill="green" />
          <URLImage
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/640px-Google_2015_logo.svg.png"
            x={100}
            y={100}
          />
          <Rect
            x={300}
            y={300}
            width={100}
            height={100}
            fill="blue"
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
}

const URLImage = ({ src, x, y }: { src: string; x: number; y: number }) => {
  const [image, setImage] = useState<CanvasImageSource | null>(null);
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
  }, [src]); // Trigger effect whenever `src` changes

  return (
    image && (
      <Image
        draggable
        width={400}
        x={x}
        y={y}
        image={image}
        alt=""
        ref={imageNode}
      />
    )
  );
};

export default page;
