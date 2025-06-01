"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const fonts = [
  { label: "Inter", value: "inter" },
  { label: "Roboto", value: "roboto" },
  { label: "Montserrat", value: "montserrat" },
  { label: "Lato", value: "lato" },
];

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const primaryColors = [
  { label: "Indigo", value: "#4F46E5" },
  { label: "Blue", value: "#2563EB" },
  { label: "Green", value: "#22C55E" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F59E42" },
  { label: "Pink", value: "#EC4899" },
];

const borderRadiuses = [
  { label: "Small", value: "0.25rem" },
  { label: "Medium", value: "0.5rem" },
  { label: "Large", value: "1rem" },
  { label: "Full", value: "9999px" },
];

const remOptions = [
  { label: "12px (0.75rem)", value: "0.75rem" },
  { label: "14px (0.875rem)", value: "0.875rem" },
  { label: "16px (1rem)", value: "1rem" },
  { label: "18px (1.125rem)", value: "1.125rem" },
  { label: "20px (1.25rem)", value: "1.25rem" },
];

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  font: string;
  setFont: (font: string) => void;
  fonts: typeof fonts;
  themes: typeof themes;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  primaryColors: typeof primaryColors;
  borderRadius: string;
  setBorderRadius: (radius: string) => void;
  borderRadiuses: typeof borderRadiuses;
  rem: string;
  setRem: (rem: string) => void;
  remOptions: typeof remOptions;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [font, setFont] = useState("inter");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [borderRadius, setBorderRadius] = useState("0.5rem");
  const [rem, setRem] = useState("1rem");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedFont = localStorage.getItem("font");
    const savedPrimary = localStorage.getItem(`primaryColor-${theme}`);
    const savedRadius = localStorage.getItem("borderRadius");
    const savedRem = localStorage.getItem("rem");
    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFont(savedFont);
    if (savedPrimary) setPrimaryColor(savedPrimary);
    if (savedRadius) setBorderRadius(savedRadius);
    if (savedRem) setRem(savedRem);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
    // Load primary color for theme
    const savedPrimary = localStorage.getItem(`primaryColor-${theme}`);
    if (savedPrimary) setPrimaryColor(savedPrimary);
  }, [theme]);

  useEffect(() => {
    document.body.style.fontFamily =
      font === "inter"
        ? "Inter, system-ui, sans-serif"
        : font === "roboto"
        ? "Roboto, system-ui, sans-serif"
        : font === "montserrat"
        ? "Montserrat, system-ui, sans-serif"
        : font === "lato"
        ? "Lato, system-ui, sans-serif"
        : "Inter, system-ui, sans-serif";
    localStorage.setItem("font", font);
  }, [font]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primaryColor);
    localStorage.setItem(`primaryColor-${theme}`, primaryColor);
  }, [primaryColor, theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", borderRadius);
    localStorage.setItem("borderRadius", borderRadius);
  }, [borderRadius]);

  useEffect(() => {
    document.documentElement.style.setProperty("--rem", rem);
    localStorage.setItem("rem", rem);
  }, [rem]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        font,
        setFont,
        fonts,
        themes,
        primaryColor,
        setPrimaryColor,
        primaryColors,
        borderRadius,
        setBorderRadius,
        borderRadiuses,
        rem,
        setRem,
        remOptions,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
