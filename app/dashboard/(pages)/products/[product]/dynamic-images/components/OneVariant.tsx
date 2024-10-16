"use client";
import { useProducts } from "@/store/products";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { getStorage, ref, uploadString } from "firebase/storage"; // Firebase imports
import { Variant } from "@/types/product";
import { useDynamicVariantsImages } from "@/store/dynamicVariantsImages";
import { Loader } from "lucide-react";

// Initialize Firebase Storage
const storage = getStorage();

function OneVariant({
  currentProductVariant,
}: {
  currentProductVariant: Variant;
}) {
  const stageRef = useRef(null);
  const { currentProduct } = useProducts();
  const { addSaveFunction } = useDynamicVariantsImages();
  const [loading, setLoading] = useState(false);

  // Function to upload the stage image to Firebase
  const uploadStageImage = () => {
    setLoading(true);
    if (!stageRef.current) return setLoading(false);

    const stage = stageRef.current;
    const dataURL = (
      stage as {
        toDataURL: () => string;
      }
    ).toDataURL(); // Get the data URL of the stage (base64 image)

    // Firebase storage reference
    if (!currentProduct) return;
    const iamgeId = `dynamicVariantsOptionsImages/stage-image-${currentProductVariant.id + currentProduct.title}.png`;
    const storageRef = ref(storage, iamgeId);

    // Upload the image as a base64 string to Firebase
    uploadString(storageRef, dataURL, "data_url")
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
        setLoading(false);
      });
    return iamgeId;
  };

  useEffect(() => {
    setTimeout(() => {
      addSaveFunction({
        [currentProductVariant.id]: uploadStageImage as () => string,
      });
    }, 4000);
  }, []);

  const quality = 0.3;

  return (
    <div className="relative">
      {/* Hidden Stage for Background Image Generation */}
      {loading && (
        <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-white ">
          <Loader className="animate-spin" />
        </div>
      )}
      <div
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "all",
        }}
        className="relative"
      >
        <Stage width={500 * quality} height={500 * quality} ref={stageRef}>
          <Layer>
            {currentProduct?.dynamicVariantsOptionsImages
              ?.filter((ov) => {
                if (!currentProductVariant.variantValues) return false;
                if (
                  currentProductVariant.variantValues.find(
                    (v) => v.value === ov.value,
                  )
                ) {
                  return true;
                } else {
                  return false;
                }
              })
              ?.map((ov) => (
                <URLImage
                  key={ov.option + ov.value}
                  src={ov.image}
                  x={ov.x * quality}
                  y={ov.y * quality}
                  width={ov.scaleX * quality}
                  height={ov.scaleY * quality}
                />
              ))}
          </Layer>
        </Stage>
      </div>

      {/* Add an upload button below the stage */}
    </div>
  );
}

const URLImage = ({
  src,
  x,
  y,
  width,
  height,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

export default OneVariant;
