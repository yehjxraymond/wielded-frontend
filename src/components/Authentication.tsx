"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

const RightPanel = () => {
  const [mode, setMode] = useState<"login" | "register">("register");
  return (
    <div className="lg:basis-2/3 basis-full min-h-screen flex flex-col">
      {/* Header component */}
      <div className="w-full flex container justify-between my-5">
        <nav className="w-full lg:hidden">
          <Link href="/">
            <div className="font-semibold text-xl">wielded_</div>
          </Link>
        </nav>
        <div className="hidden lg:block" />
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-xl font-medium mb-8">
            {mode === "register"
              ? "Create an account"
              : "Login to your account"}
          </h1>
          <Input className="mb-4" type="email" placeholder="Email" />
          <Input className="mb-4" type="password" placeholder="Password" />
          <Button className="w-full">
            {mode === "register" ? "Sign Up" : "Login"}
          </Button>
          <div className="h-8" />
        </div>
        <div>
          {mode === "register" && (
            <div>
              Already have an account?{" "}
              <span
                className="text-muted-foreground cursor-pointer"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </div>
          )}
          {mode === "login" && (
            <div>
              Don&apos;t have an account?{" "}
              <span
                className="text-muted-foreground cursor-pointer"
                onClick={() => setMode("register")}
              >
                Register
              </span>
            </div>
          )}
        </div>
        <div className="h-32" />
      </div>
    </div>
  );
};

const LeftPanel = () => {
  return (
    <div className="basis-1/3 bg-accent min-h-screen hidden lg:block">
      <nav className="w-full flex container justify-between my-5">
        <Link href="/">
          <div className="font-semibold text-xl">wielded_</div>
        </Link>
      </nav>
    </div>
  );
};

export const Authentication = () => {
  return (
    <div className="flex">
      <LeftPanel />
      <RightPanel />
    </div>
  );
};
