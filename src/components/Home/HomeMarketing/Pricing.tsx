"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { plans } from "@/constants/plans";

const tiers = plans.map((plan) => ({
  name: plan.name,
  id: plan.id,
  href: "#",
  priceMonthly: plan.priceMonthly,
  pricePostfix: plan.pricePostfix,
  description: plan.description,
  features: plan.includes,
  mostPopular: plan.id === "team_pro",
}));

export const Pricing = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-muted-foreground">
          Pricing
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Priced for teams of all sizes
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
        Straight forward pricing including budget friendly bring-your-own-key
        plans.
      </p>
      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
              tierIdx === 0 ? "lg:rounded-r-none" : "",
              tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
              tierIdx === 1 ? "lg:rounded-none" : "",
              "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={cn(
                    tier.mostPopular
                      ? "text-muted-foreground"
                      : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold leading-5 text-muted-foreground">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {tier.priceMonthly}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  {tier.pricePostfix}
                </span>
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-muted-foreground"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={
                tier.id === "tier-enterprise"
                  ? "/contact"
                  : "/login?source=pricing"
              }
            >
              <Button
                className="mt-8"
                variant={tier.mostPopular !== isDark ? "default" : "secondary"}
              >
                {tier.id === "tier-enterprise"
                  ? "Contact Sales"
                  : "Get Started"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
