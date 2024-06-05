"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useIsClient } from "usehooks-ts";
import { useMutation } from "@tanstack/react-query";

const useSubscriptionMutation = (list: string) => {
  return useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email, name, list }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.json();
    },
  });
};

export const CourseCTA: FunctionComponent<{
  className?: string;
  title: string;
}> = ({ title, className }) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const subscriptionMutation = useSubscriptionMutation(
    "u2g0f5DAb763HKmfwKu3EHEw"
  ); // AI Content Mastery Direct Signup
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    subscriptionMutation.mutate({ email, name });
  };
  if (!isClient) {
    return null;
  }
  return (
    <div className={className}>
      <div className="">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 text-center shadow-2xl sm:rounded-3xl sm:px-16 dark:bg-white">
          <h2 className="text-primary-foreground mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-6 max-w-xl text-balance leading-8">
            Seating is limited, and on first come first serve basis. Put your
            name and email below to ensure your don&apos;t lose your spot!
          </p>
          {subscriptionMutation.data?.error && (
            <Alert variant="destructive" className="mt-10 max-w-lg m-auto">
              {subscriptionMutation.data.error}
            </Alert>
          )}
          {subscriptionMutation.data?.success && (
            <div className="text-primary-foreground my-8 font-semibold">
              🎉 Welcome onboard {subscriptionMutation.data.email}! 🎉
            </div>
          )}
          {!subscriptionMutation.data?.success && (
            <form onSubmit={handleOnSubmit}>
              <div className="mt-10 block items-center justify-center">
                <Input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="First Name"
                  className="text-primary my-3"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="text-primary my-3"
                />
                <Button
                  variant="secondary"
                  className="dark:bg-secondary-foreground dark:text-secondary mt-3 mb-10 w-full"
                  disabled={subscriptionMutation.isPending}
                >
                  Get on the AI Content Mastery Waiting List
                </Button>
              </div>
            </form>
          )}
          {theme.resolvedTheme === "light" && (
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                  <stop stopColor="#4a83e0" />
                  <stop offset={1} stopColor="#7aa2e3" />
                </radialGradient>
              </defs>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
