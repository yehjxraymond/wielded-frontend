"use client";
import { Header } from "@/components/Header";
import { HomeHero } from "@/components/HomeHero";

export default function Home() {
  return (
    <main>
      {/* Hack for both component to fill entire screen */}
      <div className="flex flex-col h-screen">
        <Header />
        <HomeHero />
      </div>
    </main>
  );
}
