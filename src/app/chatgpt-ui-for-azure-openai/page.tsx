import { FaqSection } from "@/components/FaqSection";
import { HeaderPublic } from "@/components/HeaderPublic";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { FeatureHero } from "@/components/MarketingUI/FeatureHero";
import { FeatureHighlight } from "@/components/MarketingUI/FeatureHighlight";
import { TitleSeparator } from "@/components/MarketingUI/TitleSeparator";
import { Metadata } from "next";

const faqs = [
  {
    question: "How can I integrate Wielded with my Azure subscription?",
    answer:
      "Simply launch an Azure OpenAI resource, deploy a model, and input your endpoint and API key in Wielded to set up your workspace ready for team use.",
  },
  {
    question: "Can my team access both GPT-3.5 and GPT-4 through Wielded?",
    answer:
      "Yes, upon setting up your workspace with Wielded, every member will have access to both GPT-3.5 and the GPT-4 Turbo Preview. Take note that your deployed model on Azure must support the GPT-4 Turbo Preview feature.",
  },
  {
    question: "How do I invite team members to my Wielded workspace?",
    answer:
      "Manage team additions via workspace settings by sending individual or bulk invitations, which include email instructions for getting started.",
  },
  {
    question: "What happens when a team member leaves the company?",
    answer:
      "Remove the individual from your workspace in the settings to instantly revoke their access, keeping your workspace secure.",
  },
  {
    question: "Can team members have private environments on Wielded?",
    answer:
      "Yes, every team member gets their own private chats and environment, as well as shared spaces for collaborative efforts.",
  },
  {
    question: "How does Wielded prevent unexpected API bills?",
    answer:
      "Set organization-wide or individual member quotas for API usage within Wielded to manage finances and prevent bill shock. Individual quotas will override organization-wide quotas when set.",
  },
  {
    question: "Can Wielded generate images using Dall-E 3?",
    answer:
      "At this moment, Azure OpenAI Service does not yet support Dall-E 3. As soon as the feature is available we will work to bring it onto the platform.",
  },
  {
    question:
      "Is it possible to use Microsoft for Startups Founders Hub credits with Wielded?",
    answer:
      "Yes, you can use your Microsoft for Startups Founders Hub credits towards your OpenAI services. However, you will separately be billed for Wielded's subscription. Talk to us to find out how you can leverage the startup credits to reduce your AI expenses.",
  },
  {
    question: "How secure is Wielded with my company's data?",
    answer:
      "Wielded prioritizes security, ensuring all interactions are encrypted and your data is handled with utmost confidentiality aligned with Microsoft Azure's robust infrastructure.",
  },
  {
    question: "What kind of support does Wielded offer for new users?",
    answer:
      "Wielded provides comprehensive support, including personalized onboarding sessions and responsive customer service.",
  },
  {
    question: "How does team billing work with Wielded?",
    answer:
      "Wielded simplifies team billing by consolidating costs into one account, streamlining the claims process for organizations. We use Stripe as our billing partner. For other non-card type of payments, please contact us.",
  },
  {
    question: "Can I set individual API usage limits for team members?",
    answer:
      "Yes, within Wielded you can fine-tune API usage limits per team member to ensure balanced utilization and control costs.",
  },
  {
    question: "Which OpenAI models does Wielded support?",
    answer:
      "Wielded supports all current OpenAI models available through Azure, including the latest GPT-3.5 and GPT-4 Turbo Preview.",
  },
  {
    question: "Will there be training provided to use Wielded effectively?",
    answer:
      "Wielded offers resources and training materials to ensure your team can leverage the full potential of our AI productivity tools.",
  },
  {
    question: "How quickly can a Wielded workspace be deployed?",
    answer:
      "Deployment is nearly instantaneous; once your Azure OpenAI API key is entered, your workspace is ready to use.",
  },
  {
    question: "Does Wielded offer multi-language support?",
    answer:
      "Yes, Wielded leverages OpenAI's capabilities to support multiple languages, facilitating global team collaborations.",
  },
  {
    question: "Is there an option for on-premises deployment of Wielded?",
    answer:
      "Wielded is a cloud-based service optimized for Azure that is optimized for privacy. Being a hosted service allow us to get you the latest features as they get released. Talk to us if you have specific requirements around compliance.",
  },
  {
    question:
      "How does Wielded ensure compliance with data privacy regulations?",
    answer:
      "Wielded adheres to strict data privacy standards in compliance with GDPR and other regulations, ensuring data protection.",
  },
  {
    question: "Can Wielded handle large teams and enterprise-level usage?",
    answer:
      "Absolutely, Wielded is scalable to accommodate organizations of any size, from small startups to large enterprises.",
  },
  {
    question:
      "What makes Wielded different from using ChatGPT directly through OpenAI?",
    answer:
      "Wielded offers custom personas, team-centric features, and enhanced control over billing and quotas, tailored for team workflows. In addition, you can connect your Wielded workspace to Azure OpenAI services in minutes, a feature not available via OpenAI directly.",
  },
  {
    question: "Can I evaluate Wielded before committing to a subscription?",
    answer:
      "Yes, we offer a trial experience for you to assess how Wielded can align with and enhance your team's productivity. Sign up for a free account or talk to us to learn more.",
  },
  {
    question: "How can we provide feedback or suggest features for Wielded?",
    answer:
      "Wielded welcomes user feedback through our contact channels, and we actively incorporate suggestions into our development roadmap.",
  },
  {
    question: "Does Wielded offer a mobile app for on-the-go productivity?",
    answer:
      "Currently, Wielded is focused on providing a robust web-based experience. You can use Wielded on your mobile browser for on-the-go productivity.",
  },
  {
    question: "Can we set up project-specific workspaces within Wielded?",
    answer:
      "Yes, you can create multiple project-focused workspaces to organize tasks and collaborations efficiently.",
  },
];

const Content = () => {
  return (
    <>
      <HeaderPublic />
      <FeatureHero
        heading="Custom ChatGPT Interface for Your Team with Azure OpenAI"
        subheading="Deploy a private instance of ChatGPT for your team, leveraging on your existing Azure OpenAI Service subscription."
        videoUrl="https://www.youtube-nocookie.com/embed/gOPk8Ep2mTs?si=fA-86WsyHUCx578H&controls=0"
      />
      <TitleSeparator title="Simple integration and cost management" />
      <FeatureHighlight
        heading="Easy Integration"
        subheading="Streamlined Setup with Azure OpenAI for Instant Productivity"
        description="Start leveraging the power of AI in minutes. Simply create an OpenAI resource directly in your Microsoft Azure Portal, select your AI model, and paste the endpoint and API key. Your team will gain immediate access to both GPT-3.5 and GPT-4 Turbo Preview, ensuring cutting-edge AI productivity tools at your fingertips."
        imageUrl="/assets/images/setting-up-azure-openai.png"
        imageAlt="Integrating ChatGPT interface with Azure OpenAI Service"
      />
      <FeatureHighlight
        heading="Manage Access in One Place"
        subheading="Unified Member Access for Effortless Team Onboarding & Management"
        description="Onboard your team effortlessly. Utilize the workspace settings to invite new team members individually or in bulk, and let automated email instructions guide them through their setup process. Maintain tight security controls by instantly revoking access for departing team members—ensuring your workspace remains exclusive and secure."
        imageUrl="/assets/images/members-settings-light.png"
        imageAlt="Inviting team members to ChatGPT for Azure OpenAI"
      />
      <FeatureHighlight
        heading="Individual and Shared Workspace"
        subheading="Hybrid Workspaces Designed for Personal and Team Synergy"
        description="Cater to every member's preference with personal and shared workspaces. Each team member retains the privacy of their own conversations and AI environment, while simultaneously having the option to engage in collaborative work through shared chats and personas — fostering both individual excellence and team collaboration within your team."
        imageUrl="/assets/images/wielded-ui-light.png"
        imageAlt="Individual & Team ChatGPT workspace for Azure OpenAI"
      />
      <FeatureHighlight
        heading="Simple Quota Management"
        subheading="Smart Quota Allocation to Keep Your API Spending in Check"
        description="Gain peace of mind and avoid overages with our simple quota management system. Oversee your entire organization's API usage and set organizational or individual limits to prevent unexpected expenditures. With tailored quotas for both GPT-3.5 and GPT-4, your Azure OpenAI resources are optimized for efficiency and protection against abuse."
        imageAlt="ChatGPT API Quota management for Azure OpenAI"
      />
      <CtaSeparator
        title="Launch your private ChatGPT using Azure OpenAI today."
        subtitle="Need help? Contact us."
      />
      <FaqSection faqs={faqs} className="my-10" />
    </>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Custom ChatGPT Interface for Teams on Azure OpenAI - Wielded",
  description:
    "Deploy a tailored ChatGPT interface for your team using Azure OpenAI. Manage access, integrate easily, and control API costs with Wielded's cutting-edge productivity tools.",
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL("https://www.wielded.com")
      : undefined,
};
