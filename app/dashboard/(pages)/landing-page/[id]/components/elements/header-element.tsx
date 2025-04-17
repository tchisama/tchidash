"use client";

import type React from "react";

import type { PageElement } from "../../types/elements";

interface HeaderElementProps {
  element: PageElement;
}

export function HeaderElement({ element }: HeaderElementProps) {
  const { content, style } = element;
  const text = content.text || "Header Text";

  const headerStyle = {
    color: style.textColor || "#000",
    fontSize: `${style.fontSize || 24}px`,
    fontWeight: style.fontWeight || "bold",
    textAlign: style.textAlign || "left",
    padding: `${style.padding || 0}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 0}px`,
    border: style.borderWidth
      ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}`
      : "none",
    backgroundColor: style.backgroundColor || "transparent",
    lineHeight: style.lineHeight || "1.2",
  } as React.CSSProperties;

  return <div style={headerStyle}>{text}</div>;
}
