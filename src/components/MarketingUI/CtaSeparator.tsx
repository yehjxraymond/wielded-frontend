import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent } from "react";

export const CtaSeparator: FunctionComponent<{
  className?: string;
  title?: string;
  subtitle?: string;
  source?: string;
}> = ({ title, subtitle, source, className }) => {
  return (
    <div
      className={cn(
        "container py-24 sm:py-32 lg:flex lg:items-center lg:justify-between max-w-5xl",
        className
      )}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title || "Ready to Elevate Your Productivity?"}
          <br />
        </h2>
        <p className="text-xl font-bold tracking-tight sm:text-2xl mt-2">
          {subtitle || "Start with a 7-day trial today."}
        </p>
      </div>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
        <Link href={`/contact?source=${source || "cta-separator"}`}>
          <Button variant="secondary">Contact Sales</Button>
        </Link>
        <Link href={`/login?source=${source || "cta-separator"}`}>
          <Button>Get started</Button>
        </Link>
      </div>
    </div>
  );
};
