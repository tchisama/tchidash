"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const {setTheme } = useTheme();
  React.useEffect(() => {
    setTheme("light");
  },[setTheme]);
  return <NextThemesProvider  {...props}>
    {children}</NextThemesProvider>;
}
