"use client";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { ChallengesFeature } from "./ChallengesFeature";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { PainFeature } from "./PainFeature";
import { Pricing } from "./Pricing";

export const HomeMarketing = () => {
  return (
    <>
      <Hero />
      <PainFeature />
      <ChallengesFeature />
      <Features />
      <Pricing />
      <CtaSeparator />
    </>
  );
};
