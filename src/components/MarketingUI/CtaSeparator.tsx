import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FunctionComponent } from "react";

export const CtaSeparator: FunctionComponent<{
  title?: string;
  subtitle?: string;
  source?: string;
}> = ({ title, subtitle, source }) => {
  return (
    <div className="container py-24 sm:py-32 lg:flex lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title || "Ready to Elevate Your Team's Productivity?"}
          <br />
        </h2>
        <p className="text-xl font-bold tracking-tight sm:text-2xl mt-2">
          {subtitle || "Start with a free account today."}
        </p>
      </div>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
        <Link href="/contact">
          <Button variant="secondary">Contact Sales</Button>
        </Link>
        <Link href={`/login?source=${source || "cta-separator"}`}>
          <Button>Get started</Button>
        </Link>
      </div>
    </div>
  );
};
