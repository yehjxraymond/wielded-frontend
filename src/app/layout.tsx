import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GtmBody, GtmHeader } from "@/components/Analytics";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "wielded - ChatGPT for Teams",
  description: "Multiply your team's productivity & foster a collaborative and shared workspace that leverages OpenAI's cost-effective API.",
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL("https://wielded.com")
      : undefined,
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
