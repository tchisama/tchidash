"use client";
import { useDynamicVariantsImages } from "@/store/dynamicVariantsImages";
import { useProducts } from "@/store/products";
import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
} from "react-konva";

function StageComponent() {
  const {currentProduct, setCurrentProduct} = useProducts();

  const {selectedOption, setSelectedOption} = useDynamicVariantsImages();

  const handleDragEnd = (o: string, v: string, x: number, y: number) => {
    if (!currentProduct) return;
    // Update the position of the dragged image in currentProduct
    const updatedVariants = currentProduct?.dynamicVariantsOptionsImages?.map((ov) => {
      if ( ov.option === o) {
        return {
          ...ov,
          x, // Update x position
          y, // Update y position
        };
      }
      return ov;
    });

    // Update the currentProduct with the new positions
    setCurrentProduct({
      ...currentProduct,
      dynamicVariantsOptionsImages: updatedVariants,
    });
  };

  return (
    <Stage
      width={500}
      height={500}
      className="w-[500px] bg-slate-100 h-[500px] border rounded-2xl overflow-hidden"
    >
      <Layer>
        {
          currentProduct?.dynamicVariantsOptionsImages?.
          filter((ov) => ov.selected)
          .map((ov) => (
            <URLImage
              key={ov.option + ov.value}
              src={ov.image}
              x={ ov.x }
              y={ ov.y }
              width={ov.scaleX}
              height={ov.scaleY}
              onDragEnd={(x, y) => handleDragEnd(ov.option , ov.value, x, y)} 
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          ))
        }
      </Layer>
    </Stage>
  );
}

const URLImage = ({ src, x, y , width, height , onDragEnd
, selectedOption, setSelectedOption
 }: { src: string; x: number; y: number, width: number, height: number
  onDragEnd: (x: number, y: number) => void
  selectedOption: string | null,
  setSelectedOption: (option: string | null) => void
 }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageNode = useRef(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.addEventListener("load", handleLoad);

    return () => {
      img.removeEventListener("load", handleLoad);
    };

    function handleLoad() {
      setImage(img);
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
      <>
      <KonvaImage
        onClick={() => {
            setSelectedOption(src);
        }}
        stroke={selectedOption === src ? "#0003" : "#0001"}
        draggable
        {...getContainDimensions(
          image?.width as number,
          image?.height as number,
          width * 10,
          height * 10,
        )} // Here we apply the 'contain' logic
        x={x}
        y={y}
        image={image}
        alt=""
        ref={imageNode}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onDragEnd(newX, newY); // Call the drag end handler to update the x and y
        }}
      />
      </>
    )
  );
};

export default StageComponent;
