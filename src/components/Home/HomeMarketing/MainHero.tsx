import { Button } from "../../ui/button";

export const MainHero = () => {
  return (
    <div className="pb-24 pt-10 lg:pb-48 lg:pt-32 container">
      <div className="m-auto text-center flex flex-col items-center">
        <h1 className="mt-10 text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Wield the Power of AI for Teams
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl">
          Wielded is an intuitive ChatGPT UI for teams. Multiply your team&apos;s
          productivity & foster a collaborative and shared workspace that
          leverages OpenAI&apos;s cost-effective API.
        </p>
        <div className="mt-12 flex items-center gap-x-6">
          <Button>Start for Free</Button>
          {/* TODO Savings calculator */}
        </div>
      </div>
    </div>
  );
};
