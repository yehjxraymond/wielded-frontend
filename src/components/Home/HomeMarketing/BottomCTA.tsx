import { Button } from "@/components/ui/button";
import Link from "next/link";

export const BottomCTA = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to Elevate Your Team&apos;s Productivity?
        <br />
        Start with a free account today.
      </h2>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
        <Link href="/login?source=cta-bottom">
          <Button>Get started</Button>
        </Link>
      </div>
    </div>
  );
};
