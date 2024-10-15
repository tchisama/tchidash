import { useDynamicVariantsImages } from "@/store/dynamicVariantsImages";
import { useProducts } from "@/store/products";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";

function StageComponent() {
  const { currentProduct, setCurrentProduct } = useProducts();
  const { selectedOption, setSelectedOption } = useDynamicVariantsImages();
  const stageRef = useRef(null);

  const handleDragEnd = (o: string, v: string, x: number, y: number) => {
    if (!currentProduct) return;
    const updatedVariants = currentProduct?.dynamicVariantsOptionsImages?.map(
      (ov) => {
        if (ov.option === o) {
          return { ...ov, x, y };
        }
        return ov;
      },
    );
    setCurrentProduct({
      ...currentProduct,
      dynamicVariantsOptionsImages: updatedVariants,
    });
  };


  return (
    <div>
      <Stage
        width={500}
        height={500}
        className="w-[500px] bg-slate-100 h-[500px] border rounded-2xl overflow-hidden"
        ref={stageRef}
      >
        <Layer>
          {currentProduct?.dynamicVariantsOptionsImages
            ?.filter((ov) => ov.selected)
            .map((ov) => (
              <URLImage
                key={ov.option + ov.value}
                src={ov.image}
                x={ov.x}
                y={ov.y}
                width={ov.scaleX}
                height={ov.scaleY}
                onDragEnd={(x, y) => handleDragEnd(ov.option, ov.value, x, y)}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
}

const URLImage = ({
  src,
  x,
  y,
  width,
  height,
  onDragEnd,
  selectedOption,
  setSelectedOption,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onDragEnd: (x: number, y: number) => void;
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageNode = useRef(null);

  useEffect(() => {
    const fetchImageThroughProxy = async () => {
      try {
        const response = await fetch("/api/proxy-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: src }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image through proxy");
        }

        const blob = await response.blob();
        const img = new window.Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
          setImage(img);
        };
      } catch (err) {
        console.error("Failed to fetch image: ", err);
      }
    };

    fetchImageThroughProxy();
  }, [src]);

  return (
    image && (
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
        )}
        x={x}
        y={y}
        image={image}
        alt="Loaded Image"
        ref={imageNode}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onDragEnd(newX, newY);
        }}
      />
    )
  );
};

export const getContainDimensions = (
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

export default StageComponent;
