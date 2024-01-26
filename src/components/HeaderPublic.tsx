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

const productFeatures: { title: string; href: string; description: string }[] =
  [
    {
      title: "ChatGPT Interface for Your Team",
      description:
        "Deploy an organization-wide ChatGPT and consolidate billing for the entire team.",
      href: "/chatgpt-for-teams",
    },
    {
      title: "Creating Custom AI Chatbots with Personas",
      description:
        "Using custom instructions, create AI chatbots that are tailored to your business workflows.",
      href: "/creating-custom-ai-chatbot-with-persona",
    },
    {
      title: "Private ChatGPT with Azure OpenAI",
      description:
        "Deploy a private instance of ChatGPT for your team, leveraging on your Azure subscription.",
      href: "/chatgpt-ui-for-azure-openai",
    },
    {
      title: "Generating Images in Bulk with Dall-E 3",
      description:
        "Generate up to 50 images per minute with Dall-E 3, and unlock the creative potential of your team.",
      href: "/image-generation-with-dalle3",
    },
    {
      title: "Chat with your Documents",
      description:
        "Summarize, translate & review documents, or simply ask questions.",
      href: "/chat-with-documents",
    },
    {
      title: "Teaching Generative AI with Wielded",
      description:
        "Deploy a generative AI environment for your classroom with all the tools you need to teach AI.",
      href: "/teaching-generative-ai-for-educator",
    },
    {
      title: "Multi-model AI Lab for Education",
      description:
        "Explore OpenAI & Anthropic AI models and prompting techniques in your classrooms.",
      href: "/multi-model-ai-lab-for-education",
    },
  ];

export function NavigationDropdownMenu() {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[780px]">
              {productFeatures.map((component) => (
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
        <NavigationMenuItem>
          <Link href="/chatgpt-prompt" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              ChatGPT Prompt Library
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/contact?source=nav-bar" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
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
  const [productsOpen, setProductsOpen] = React.useState(false);
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
            onClick={() => setProductsOpen(!productsOpen)}
          >
            Products
          </div>
          {productsOpen && (
            <div className="pl-4">
              {productFeatures.map((component) => (
                <div className="font-medium mb-4" key={component.title}>
                  <Link href={component.href}>{component.title}</Link>
                </div>
              ))}
            </div>
          )}
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
            <Link href="/chatgpt-prompt">ChatGPT Prompt Library</Link>
          </div>
          <div className="text-lg font-medium mb-4">
            <Link href="https://newsletter.wielded.com">Newsletter</Link>
          </div>
          <div className="text-lg font-medium mb-4">
            <Link href="/login?mode=login&source=navigation-mobile">Login</Link>
          </div>
          <div className="text-lg font-medium mb-4">
            <Link href="/login?source=navigation-mobile">Register</Link>
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
        <div className="font-semibold text-xl">Wielded</div>
      </Link>
      {/* Desktop Navigation */}
      <NavigationDropdownMenu />
      <div className="hidden lg:flex gap-2">
        <Link href="/login?mode=login&source=navigation-top">
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
