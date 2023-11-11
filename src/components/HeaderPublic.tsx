"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

const useCases: { title: string; href: string; description: string }[] = [
  {
    title: "ChatGPT for Educators",
    description: "Elevate teaching with AI-assisted curriculum planning.",
    href: "/for-educator",
  },
  {
    title: "ChatGPT for Digital Marketers",
    description: "Boost campaigns with AI-driven marketing insights.",
    href: "/for-digital-marketer",
  },
  {
    title: "ChatGPT for Content Creators",
    description: "Streamline creation with AI-powered content tools.",
    href: "/for-content-creator",
  },
  {
    title: "ChatGPT for Product Managers",
    description: "Enhance product roadmaps with AI-generated data.",
    href: "/for-product-manager",
  },
  {
    title: "ChatGPT for Product Teams",
    description: "Empower teams with AI-fueled project collaboration.",
    href: "/for-product-team",
  },
  {
    title: "ChatGPT for Sales Teams",
    description: "Boost sales with personalized AI engagement strategies.",
    href: "/for-sales-team",
  },
  {
    title: "ChatGPT for Customer Support",
    description: "Revolutionize support with AI-enhanced customer service.",
    href: "/for-customer-support",
  },
];

export function NavigationDropdownMenu() {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              ChatGPT for Teams
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Use Cases</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {useCases.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <div>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </div>
  );
});
ListItem.displayName = "ListItem";

const MobileMenu = () => {
  const [useCasesOpen, setUseCasesOpen] = React.useState(false);
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <div className="mt-12">
          <div className="text-lg font-medium mb-4">
            <Link href="/">Home</Link>
          </div>
          <div
            className="text-lg font-medium mb-4 cursor-pointer"
            onClick={() => setUseCasesOpen(!useCasesOpen)}
          >
            Use Cases
          </div>
          {useCasesOpen && (
            <div className="pl-4">
              {useCases.map((component) => (
                <div className="font-medium mb-4" key={component.title}>
                  <Link href={component.href}>{component.title}</Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-lg font-medium mb-4">
            <Link href="/login?mode=login">Login</Link>
          </div>
          <div className="text-lg font-medium mb-4">
            <Link href="/login">Register</Link>
          </div>
        </div>
        <ThemeToggle />
      </SheetContent>
    </Sheet>
  );
};

export const HeaderPublic = () => {
  return (
    <nav className="w-full flex container justify-between my-5">
      <Link href="/">
        <div className="font-semibold text-xl">wielded_</div>
      </Link>
      {/* Desktop Navigation */}
      <NavigationDropdownMenu />
      <div className="hidden lg:flex gap-2">
        <Link href="/login?mode=login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/login?source=navigation-top">
          <Button>Register</Button>
        </Link>
      </div>
      {/* Mobile Navigation */}
      <MobileMenu />
    </nav>
  );
};
