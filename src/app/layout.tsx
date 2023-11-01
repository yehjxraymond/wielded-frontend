import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GtmBody, GtmHeader } from "@/components/Analytics";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "wielded_",
  description: "Supercharge your team with AI",
  metadataBase: new URL("https://wielded.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <GtmHeader />
      </head>
      <body className={inter.className}>
        <Suspense>
          <GtmBody />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
