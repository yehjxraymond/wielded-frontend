import { Button } from "../ui/button";
import { Typewriter } from "../ui/typewriter";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const words = ["marketer", "copywriter", "founder", "manager"]; // Words for the typewriter effect

export function Hero() {
  return (
    <header className="to-primary/10 relative border-b pb-20 pt-8 lg:pb-40 lg:pt-16">
      <div className="container text-center">
        <p className="mb-6 tracking-tight opacity-75 text-balance">
          AI workspace with access to GPT-4o & Claude 3.5 Sonnet in a single subscription
        </p>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-snug opacity-90 lg:text-7xl lg:leading-snug">
          Get More Done with Generative AI
        </h1>

        <p className="mt-14 text-balance text-xl font-semibold tracking-tight opacity-75">
          Built for you, the
          <span className="hidden lg:inline">
            {" "}
            modern-day{" "}
            <Typewriter
              words={words}
              className="border-b-4 border-b-gray-300"
            />
            .
          </span>
        </p>
        <p className="mb-14 text-balance text-xl font-semibold tracking-tight opacity-75 lg:hidden">
          modern-day{" "}
          <Typewriter words={words} className="border-b-4 border-b-gray-300" />.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row">
          <Link href="/auth/signup">
            <Button size="lg">
              Sign Up Free
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
