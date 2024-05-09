import { FaqSection } from "@/components/FaqSection";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { FeatureHero } from "@/components/MarketingUI/FeatureHero";
import { FeatureHighlight } from "@/components/MarketingUI/FeatureHighlight";
import { TitleSeparator } from "@/components/MarketingUI/TitleSeparator";
import { PublicLayout } from "@/components/PublicLayout";
import { Metadata } from "next";

const faqs = [
  {
    question:
      "What makes Wielded different from other ChatGPT tools for teams?",
    answer:
      "Wielded stands out with its advanced persona switching capabilities, seamless integration into collaborative team workflows, and intuitive team workspaces that enhance productivity. Add to this our Streamlined Team Management & Billing, and you get a unique AI productivity platform tailored for team success.",
  },
  {
    question: "How fast can I get started with Wielded?",
    answer:
      "You can deploy Wielded rapidly across your team thanks to our streamlined setup process. Within minutes, your team can start leveraging the power of AI for productivity.",
  },
  {
    question: "How does Wielded support collaborative teams?",
    answer:
      "Wielded is designed to facilitate a shared workspace environment where team members can easily collaborate on projects, share personas and prompts, and enhance their communicative workflow with the power of AI.",
  },
  {
    question: "How does persona switching work in Wielded?",
    answer:
      "Persona switching in Wielded allows users to switch between roles or tasks, maintaining context and preferences. This feature supports multitasking and enhances workflow efficiency without losing the continuity of the work.",
  },
  {
    question:
      "How does Wielded ensure the privacy and security of our team's conversations?",
    answer:
      "We prioritize privacy and security in our AI-enhanced team environments with encrypted communications and strict data privacy protocols that comply with industry standards.",
  },
  {
    question:
      "Is there a limit to the number of personas we can create in Wielded?",
    answer:
      "Wielded offers the flexibility to create as many personas as your team needs, allowing for customization and specificity to match your diverse project demands.",
  },
  {
    question:
      "Can Wielded's AI help with specific tasks like coding or design?",
    answer:
      "Absolutely, Wielded’s AI is equipped to assist with a wide range of tasks, from coding challenges to design creativity, providing expert-level guidance and accelerating project completion.",
  },
  {
    question: "How can Wielded improve our team's productivity?",
    answer:
      "By integrating Wielded, your team taps into the efficiency of AI-driven task management, rapidly generated content, and collaborative workspaces, all of which are designed to significantly boost productivity.",
  },
  {
    question: "What is the process for adding new team members to Wielded?",
    answer:
      "You can add new team members effortlessly through our centralized team management system, which supports invitations and role assignments to get new members up and running in no time.",
  },
  {
    question: "How does team billing work with Wielded?",
    answer:
      "Our team billing consolidates all subscription expenses into a single account, simplifying the management of finances and allowing for straightforward team expenditure tracking and reporting.",
  },
  {
    question:
      "Is there any training provided to get our team up to speed with Wielded?",
    answer:
      "Yes, we provide comprehensive training materials and support to ensure your team can fully utilize all features of Wielded, helping you make the most out of your AI-driven productivity platform.",
  },
  {
    question: "How are updates to Wielded's features rolled out to teams?",
    answer:
      "Updates are automatically deployed to ensure that all teams have access to the latest features and improvements, with no action required on your part.",
  },
  {
    question:
      "Can individual team members have their own private ChatGPT sessions in Wielded?",
    answer:
      "Every team member can enjoy private ChatGPT sessions within Wielded, allowing them to work on individual tasks with the assistance of AI while maintaining privacy.",
  },
  {
    question: "How does Wielded facilitate better collaboration on projects?",
    answer:
      "With shared workspaces, collaborative prompts, and the ability to utilize shared knowledge, Wielded is designed to promote an environment where collaboration on projects is not only possible but thrives.",
  },
  {
    question:
      "How does Wielded handle data privacy and compliance, especially for sensitive industries?",
    answer:
      "Wielded adheres to strict data privacy regulations and compliance standards, ensuring sensitive information is handled responsibly and securely within any industry.",
  },
  {
    question:
      "What kind of support is available if we experience any issues with Wielded?",
    answer:
      "Our dedicated support team is always ready to help with any questions or issues you may encounter, providing assistance to ensure a smooth experience with Wielded.",
  },
  {
    question:
      "What are the technical requirements for deploying Wielded within our team?",
    answer:
      "Wielded is designed to be easily deployable with minimal technical requirements. A stable internet connection and access to a web browser are all that’s needed to start reaping the benefits of our AI productivity platform.",
  },
  {
    question:
      "Can Wielded generate high-quality images for our team's marketing materials?",
    answer:
      "Yes, Wielded integrates with Dall-E 3 to produce high-quality images, providing your marketing team with an extensive array of visually stunning and creative assets.",
  },
  {
    question:
      "How do we transition our team to using Wielded from another ChatGPT tool?",
    answer:
      "Transitioning to Wielded is seamless as we guide you through every step, from setting up your team workspaces to transferring data, ensuring a smooth migration from other ChatGPT tools.",
  },
  {
    question:
      "How does Wielded's AI adapt to different team members' styles and preferences?",
    answer:
      "Wielded’s AI is designed to learn and adapt to individual team member's styles and preferences, providing personalized assistance that improves over time with use.",
  },
  {
    question:
      "What happens if a team member leaves the company? How is their Wielded access managed?",
    answer:
      "When a team member leaves your company, their access to Wielded can be immediately revoked through the admin dashboard, ensuring that your team's information remains secure.",
  },
  {
    question: "Is Wielded suitable for remote or distributed teams?",
    answer:
      "Wielded is perfect for remote and distributed teams, offering a centralized platform that bridges the gap between various locations and time zones to maintain cohesive collaboration.",
  },
  {
    question:
      "How do we provide feedback on Wielded to help shape future features?",
    answer:
      "We value user feedback greatly. You can provide feedback directly through the Wielded platform or by reaching out to our support team. Your insights help us continually evolve and enhance Wielded to best meet your needs.",
  },
];

const Content = () => {
  return (
    <PublicLayout>
      <FeatureHero
        heading="Deploy ChatGPT for Your Team with Wielded"
        subheading="Unleash the full potential of collaborative AI across your organization for unmatched productivity."
        videoUrl="https://www.youtube-nocookie.com/embed/3lZb8Wym6tE?si=Xux9dM3Tp6DZl3rM&controls=0"
        source="chatgpt-for-teams"
      />
      <TitleSeparator title="Scale Your Team with AI, Not Headcounts" />
      <FeatureHighlight
        heading="Intuitive Team Workspaces"
        subheading="Enhance focus and team interaction"
        description="Strike the perfect balance between individual and team work within a shared, AI-enhanced environment where productivity and collaboration thrive side by side."
        imageUrl="/assets/images/wielded-ui-light.png"
        imageAlt="Intuitive Team Workspaces"
      />
      <FeatureHighlight
        heading="Context-Sensitive Persona Switching"
        subheading="Experience seamless task transitions"
        description="Transition smoothly between different work contexts, with personas preserving the depth and nuances of each project, ensuring continuity and efficiency."
        imageUrl="/assets/images/persona-light.png"
        imageAlt="Context-Sensitive Persona Switching"
      />
      <FeatureHighlight
        heading="Rapid Team Deployment"
        subheading="AI Integration in a flash"
        description="Deploy the full suite of Wielded AI tools to your entire team instantly with OpenAI API key or Azure OpenAI Service. Eliminate downtime and set the stage for immediate productivity boosts, with simple, one-step implementation."
        imageUrl="/assets/images/setting-up-azure-openai.png"
        imageAlt="Rapid Team Deployment"
      />
      <FeatureHighlight
        heading="Simplified Team Billing and Claim Process"
        subheading="Consolidate expenses, streamline operations"
        description="Leverage our straightforward team billing process to minimize administrative overhead. Focus on what truly matters—scaling your team’s engagement and output. No more dealing with individual claims for multiple ChatGPT Plus Subscriptions."
        imageUrl="/assets/images/seats-management-team-billing.png"
        imageAlt="Simplified Team Billing and Claim Process"
      />
      <CtaSeparator
        title="Empower Your Team with ChatGPT Today"
        subtitle="Connect with us for a demo, or start your journey to team-wide AI integration now!"
        source="chatgpt-for-teams"
      />
      <FaqSection faqs={faqs} className="my-10" />
    </PublicLayout>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Wielded - AI Productivity Platform for Collaborative Teams",
  description:
    "Scale team efficiency and creativity with Wielded, the AI productivity tool that provides intuitive workspaces, persona switching, rapid deployment, and simple team billing tailored for collaborative teams.",
  keywords:
    "ChatGPT for teams, ChatGPT for business, ChatGPT enterprise solutions, team collaboration AI, streamlined billing and user management",
};
