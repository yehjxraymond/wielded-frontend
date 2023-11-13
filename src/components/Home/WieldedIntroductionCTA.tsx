import { Button } from "@/components/ui/button";
import Link from "next/link";

export const WieldedIntroductionCTA = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Wielded is how modern teams leverage ChatGPT.
        </h2>
        <div className="pt-4 text-muted-foreground tracking-tight max-w-xl font-medium">
          <p>
            Multiply your team&apos;s productivity & foster a collaborative and
            shared workspace that leverages OpenAI&apos;s cost-effective API.
          </p>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
        <Link href="/?source=cta-bottom">
          <Button>More Info</Button>
        </Link>
      </div>
    </div>
  );
};
