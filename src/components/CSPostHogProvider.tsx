// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { FunctionComponent, ReactNode } from "react";

if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable automatic pageleave capture
    });
  }
}
export const CSPostHogProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
