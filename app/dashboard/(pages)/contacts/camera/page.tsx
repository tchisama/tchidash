"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CursorPosition {
  x: number;
  y: number;
}

const FingerCursor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState("");
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
  });

  // Constants for cursor sensitivity
  const MOVEMENT_MULTIPLIER = 2; // Increase this for faster movement
  const SMOOTHING_FACTOR = 0.3; // Adjust this for smoother/faster response

  useEffect(() => {
    let handTracker: any = null;
    let camera: any = null;

    const initializeHandTracking = async () => {
      try {
        const { Hands } = await import("@mediapipe/hands");
        const { Camera } = await import("@mediapipe/camera_utils");

        handTracker = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        handTracker.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        handTracker.onResults(handleResults);

        if (videoRef.current) {
          camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (handTracker && videoRef.current) {
                await handTracker.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });

          await camera.start();
          setError("");
        }
      } catch (err) {
        setError(
          "Error initializing hand tracking. Please check your camera permissions.",
        );
        console.error(err);
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Unable to access camera. Please check permissions.");
        console.error(err);
      }
    };

    if (isTracking) {
      startCamera().then(initializeHandTracking);
    }

    return () => {
      if (camera) {
        camera.stop();
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isTracking]);

  const handleResults = (results: any) => {
    if (!results.multiHandLandmarks || !canvasRef.current || !cursorRef.current)
      return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexFinger = landmarks[8]; // Index fingertip

      // Draw landmarks
      ctx.fillStyle = "red";
      landmarks.forEach((landmark: any) => {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvasRef.current!.width,
          landmark.y * canvasRef.current!.height,
          3,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      });

      // Draw connection for index finger
      ctx.beginPath();
      ctx.moveTo(
        landmarks[5].x * canvasRef.current.width,
        landmarks[5].y * canvasRef.current.height,
      );
      ctx.lineTo(
        landmarks[6].x * canvasRef.current.width,
        landmarks[6].y * canvasRef.current.height,
      );
      ctx.lineTo(
        landmarks[7].x * canvasRef.current.width,
        landmarks[7].y * canvasRef.current.height,
      );
      ctx.lineTo(
        landmarks[8].x * canvasRef.current.width,
        landmarks[8].y * canvasRef.current.height,
      );
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Map finger position to window coordinates with multiplier and fix mirroring
      // Invert the x-coordinate by subtracting from 1
      const normalizedX = 1 - indexFinger.x; // Fix mirroring
      const centerOffsetX = (normalizedX - 0.5) * MOVEMENT_MULTIPLIER;
      const centerOffsetY = (indexFinger.y - 0.5) * MOVEMENT_MULTIPLIER;

      const x = window.innerWidth / 2 + centerOffsetX * window.innerWidth;
      const y = window.innerHeight / 2 + centerOffsetY * window.innerHeight;

      // Update cursor position with smoothing
      setCursorPosition((prev) => ({
        x: prev.x + (x - prev.x) * SMOOTHING_FACTOR,
        y: prev.y + (y - prev.y) * SMOOTHING_FACTOR,
      }));
    }
  };

  // Clamp cursor position to screen bounds
  const clampedPosition = {
    x: Math.max(0, Math.min(window.innerWidth, cursorPosition.x)),
    y: Math.max(0, Math.min(window.innerHeight, cursorPosition.y)),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 pointer-events-none z-50"
        style={{
          left: `${clampedPosition.x}px`,
          top: `${clampedPosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="8" fill="rgba(59, 130, 246, 0.5)" />
          <circle cx="12" cy="12" r="4" fill="rgb(59, 130, 246)" />
        </svg>
      </div>

      {/* Camera Preview */}
      <div className="absolute bottom-4 right-4 w-[500px] bg-slate-900 rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            className="absolute w-full h-full object-cover mirror"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute w-full h-full"
            width={640}
            height={480}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Button
          onClick={() => setIsTracking(!isTracking)}
          className={
            isTracking
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }
        >
          <Camera className="mr-2 h-4 w-4" />
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="absolute top-4 left-4 w-96">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Demo Area */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Move Your Index Finger</h1>
          <p className="text-lg text-gray-600">
            The cursor will follow your fingertip
          </p>
        </div>
      </div>
    </div>
  );
};

export default FingerCursor;
