"use client";

import type React from "react";
import type { PageElement, Specification } from "../../types/elements";

interface SpecificationsElementProps {
  element: PageElement;
}

export function SpecificationsElement({ element }: SpecificationsElementProps) {
  const { style, content } = element;
  const specifications = content.specifications || [];

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

  const nameStyle = {
    fontSize: `${style.nameFontSize || 14}px`,
    fontWeight: style.nameFontWeight || "medium",
    color: style.nameColor || "#000000",
  };

  const valueStyle = {
    fontSize: `${style.valueFontSize || 14}px`,
    color: style.valueColor || "#6b7280",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {content.sectionTitle || "Product Specifications"}
      </h2>
      <p style={subtitleStyle}>
        {content.subtitle || "Technical details and dimensions"}
      </p>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full">
          <tbody>
            {specifications.map((spec: Specification, index: number) => (
              <tr
                key={spec.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? style.rowBgColor || "#f9fafb"
                      : style.altRowBgColor || "#ffffff",
                }}
              >
                <td className="py-3 px-4 border-b border-r" style={nameStyle}>
                  {spec.name}
                </td>
                <td className="py-3 px-4 border-b" style={valueStyle}>
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
