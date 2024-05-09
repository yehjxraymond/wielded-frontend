"use client";
import { FooterPublic } from "@/components/FooterPublic";
import { HeaderPublic } from "@/components/HeaderPublic";
import { FunctionComponent, ReactNode } from "react";

export const PublicLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <main>
      <HeaderPublic />
      {children}
      <FooterPublic />
    </main>
  );
};
