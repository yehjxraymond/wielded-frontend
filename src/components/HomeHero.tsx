import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";

export const HomeHero = () => {
  const [email, setEmail] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
  };
  return (
    <div className="container flex-grow flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold">Supercharge your team with AI</h1>
      <h2 className="text-muted-foreground font-medium mt-2">
        Join the early access waitlist
      </h2>

      <form
        className="flex w-full max-w-md items-center space-x-2 mt-8"
        onSubmit={onSubmit}
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="whitespace-nowrap">
          Join Waitlist
        </Button>
      </form>

      <div className="my-20" />
    </div>
  );
};
