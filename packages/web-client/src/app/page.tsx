"use client";

import Hero from "./components/Hero";
import { GeistProvider, CssBaseline } from "@geist-ui/core";

export default function Home() {
  return (
    <GeistProvider themeType="dark">
      <CssBaseline />
      <Hero />
    </GeistProvider>
  );
}
