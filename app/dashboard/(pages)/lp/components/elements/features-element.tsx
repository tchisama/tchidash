"use client";

import type React from "react";
import type { PageElement, Feature } from "../../types/elements";
import {
  Shield,
  ThumbsUp,
  Layers,
  Clock,
  Heart,
  Zap,
  Award,
  Truck,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface FeaturesElementProps {
  element: PageElement;
}

export function FeaturesElement({ element }: FeaturesElementProps) {
  const { style, content } = element;
  const features = content.features || [];

  const containerStyle = {
    padding: `${style.padding || 24}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth
      ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}`
      : "1px solid #e5e7eb",
    backgroundColor: style.backgroundColor || "#ffffff",
  };

  const titleStyle = {
    color: style.titleColor || "#000",
    fontSize: `${style.titleFontSize || 24}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: "8px",
    textAlign:
      (style.titleAlign as React.CSSProperties["textAlign"]) || "center",
  };

  const subtitleStyle = {
    color: style.subtitleColor || "#6b7280",
    fontSize: `${style.subtitleFontSize || 16}px`,
    marginBottom: "32px",
    textAlign:
      (style.subtitleAlign as React.CSSProperties["textAlign"]) || "center",
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return (
          <Shield
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "ThumbsUp":
        return (
          <ThumbsUp
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Layers":
        return (
          <Layers
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Clock":
        return (
          <Clock
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Heart":
        return (
          <Heart
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Zap":
        return (
          <Zap
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Award":
        return (
          <Award
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Truck":
        return (
          <Truck
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      case "Sparkles":
        return (
          <Sparkles
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
      default:
        return (
          <CheckCircle
            className="h-6 w-6"
            style={{ color: style.iconColor || "#000000" }}
          />
        );
    }
  };

  const columns = style.columns || 3;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{content.sectionTitle || "Product Features"}</h2>
      <p style={subtitleStyle}>
        {content.subtitle || "Why our product stands out from the rest"}
      </p>

      <div
        className={`grid grid-cols-1 md:grid-cols-${columns} gap-${style.featureSpacing || 16}`}
      >
        {features.map((feature: Feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center text-center p-4"
          >
            <div className="mb-4">
              {getIconComponent(feature.iconName || "CheckCircle")}
            </div>
            <h3
              className="font-medium mb-2"
              style={{
                fontSize: `${style.featureTitleSize || 18}px`,
                color: style.featureTitleColor || "#000000",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: `${style.featureTextSize || 14}px`,
                color: style.featureTextColor || "#6b7280",
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
