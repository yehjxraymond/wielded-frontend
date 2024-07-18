import { Feather, FlaskConical, Home, Hotel } from "lucide-react";

export interface Plan {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  price: string;
  priceMonthly: string;
  pricePostfix?: string;
  priceNumber: number;
  includes: string[];
  cta?: {
    targetPlan: string;
    title: string;
    description: string[];
    ctaText: string;
  };
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    icon: <FlaskConical size={50} className="text-muted-foreground mb-4" />,
    description: "Bring-your-own-key plan for individuals",
    priceNumber: 0,
    price: "$0/user/month",
    priceMonthly: "$0",
    pricePostfix: "/user/month",
    includes: [
      "Bring your own keys",
      "Chat with GPT-4o & Claude 3.5 Sonnet",
      "Up to 2 team members in workspace",
    ],
    cta: {
      targetPlan: "team_pro",
      title: "Access all AI models",
      description: [
        "Upgrade to Pro to get access to all models & features without bringing your own keys.",
        "Get instant access to GPT-4 Turbo, Claude 3, Image generation, and Speech-to-text input!",
      ],
      ctaText: "Upgrade to Pro",
    },
  },
  {
    id: "team",
    name: "Lite Plan",
    icon: <Feather size={50} className="text-muted-foreground mb-4" />,
    description: "Bring-your-own-key plan for teams",
    price: "$3.50/user/month",
    priceMonthly: "$3.50",
    pricePostfix: "/user/month",
    priceNumber: 3.5,
    includes: [
      "Everything in free plan",
      "Unlimited team members in workspace",
      "Email support",
    ],
    cta: {
      targetPlan: "team_pro",
      title: "Greater data privacy",
      description: [
        "Upgrade to Pro for greater data privacy with private models.",
        "Your data is not shared with model providers or used to improve the base model with Pro.",
      ],
      ctaText: "Upgrade to Pro",
    },
  },
  {
    id: "team_pro",
    name: "Pro Plan",
    icon: <Home size={50} className="text-muted-foreground mb-4" />,
    description: "Fuss-free access to all AI models",
    price: "$20/user/month",
    priceMonthly: "$20",
    pricePostfix: "/user/month",
    priceNumber: 20,
    includes: [
      "Subscription to all latest models",
      "GPT-4o & Claude 3.5 Sonnet included",
      "Image generation",
      "Speech-to-text input",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: <Hotel size={50} className="text-muted-foreground mb-4" />,
    description: "For large organizations with custom needs",
    price: "Contact Sales for pricing",
    priceMonthly: "Contact us",
    priceNumber: 0,
    includes: [
      "Everything in Pro plan",
      "Minimum of 25 seats",
      "Custom domain",
      "Single sign-on (SSO)",
      "Dedicated account manager",
    ],
  },
];
