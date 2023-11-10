"use client";
import { HeaderPublic } from "@/components/HeaderPublic";
import { MainHero } from "./MainHero";
import { MainFeatures } from "./MainFeatures";
import { Pricing } from "./Pricing";
import { BottomCTA } from "./BottomCTA";

export const HomeMarketing = () => {
  return (
    <>
      <HeaderPublic />
      <MainHero />
      <MainFeatures />
      <Pricing />
      <BottomCTA />
    </>
  );
};
