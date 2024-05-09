"use client";
import { BottomCTA } from "./BottomCTA";
import { MainFeatures } from "./MainFeatures";
import { MainHero } from "./MainHero";
import { Pricing } from "./Pricing";

export const HomeMarketing = () => {
  return (
    <>
      <MainHero />
      <MainFeatures />
      <Pricing />
      <BottomCTA />
    </>
  );
};
