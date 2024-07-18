"use client";

import { Star } from "lucide-react";
import { StyledLink } from "./StyledLink";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Features() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <section className="bg-card text-card-foreground mt-24 mx-auto max-w-5xl">
      <div className="prose prose-lg m-auto text-center opacity-90">
        <h2>Ready for a change?</h2>
        <p className="text-balance">
          Imagine having all the power of AI, without the headaches.
        </p>
      </div>

      <div className="my-20">
        {isDark ? (
          <Image
            className="rounded-xl drop-shadow-lg m-auto"
            src="/assets/images/wielded-ui-dark.png"
            width={900}
            height={800}
            alt="ChatGPT Unified Team Workspace UI"
          />
        ) : (
          <Image
            className="rounded-xl drop-shadow-lg m-auto"
            src="/assets/images/wielded-ui-light.png"
            width={900}
            height={800}
            alt="ChatGPT Unified Team Workspace UI"
          />
        )}
      </div>

      <div className="my-16 grid grid-cols-1 md:grid-cols-2">
        <div className="my-10">
          <h3 className="text-3xl font-bold opacity-90">
            Sound Like You, Always
          </h3>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Extract writing style from existing work</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Save and reuse your personal writing styles</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Create content that reflects your brand voice</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>No more generic AI-generated content</p>
          </div>
        </div>
        <div className="my-10">
          <h3 className="text-3xl font-bold opacity-90">
            Streamline Your Workflow
          </h3>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Create custom AI profiles for different tasks</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Automate repetitive work with smart templates</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Tailor AI assistants for each team role</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Use voice commands for hands-free productivity</p>
          </div>
        </div>
        <div className="my-10">
          <h3 className="text-3xl font-bold opacity-90">
            Multiple LLMs, One Place
          </h3>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Choose the best model for every task</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Switch between models with a single click</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Experiment and compare outputs across models</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Automatic access to latest models</p>
          </div>
        </div>
        <div className="my-10">
          <h3 className="text-3xl font-bold opacity-90">
            Simplified Subscription
          </h3>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>One subscription for all latest models</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>One plan for your or your entire team</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Flexible scaling as your needs change</p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Star className="text-primary h-4 w-4" />
            <p>Risk-free 7-day trial to get started</p>
          </div>
        </div>
      </div>
    </section>
  );
}
