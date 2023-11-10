import { CaseStudy, CaseStudyData } from "@/components/CaseStudy";
import { Metadata } from "next";

const caseStudyData: CaseStudyData = {
  idealCustomer: "Sales Teams",
  pageTitle: "Unlocking Sales Potential with ChatGPT",
  keyChallenges: {
    heading: "Key Challenges for Sales Teams",
    description:
      "Sales teams are the driving force behind revenue generation, but they face numerous barriers that can impede their success. This section aims to target the obstacles experienced by these teams and introduce a fitting solution that Wielded presents.\n\nWhile the challenges persist, there is a pathway to overcoming them. Wielded offers robust solutions to usher sales teams into a new era of efficiency and productivity.",
    challenges: [
      {
        title: "Prospect Sourcing and Qualification",
        heading1: "Identifying Quality Leads",
        description1:
          "The pursuit to find and target high-value leads can often be a time-consuming task that distracts sales professionals from their primary goals.",
        heading2: "Effective Lead Qualification",
        description2:
          "Distinguishing between casual inquiries and genuine prospects requires insight and precision, a balance often hard to strike efficiently.",
      },
      {
        title: "Administrative Overload",
        heading1: "Data Entry and CRM Management",
        description1:
          "Tedious administrative tasks, such as entering data into CRM systems, detract from valuable selling time and can lead to reduced productivity.",
        heading2: "Sales Reporting and Analysis",
        description2:
          "Creating detailed reports and analyzing sales data is critical but can be excessively time-consuming.",
      },
      {
        title: "Customer Relationship Management",
        heading1: "Maintaining Engagement",
        description1:
          "Cultivating and maintaining relationships with clients demands consistent and personalized communication—a process that is often challenging to manage at scale.",
        heading2: "Managing Post-Sale Follow-Ups",
        description2:
          "Ensuring customer satisfaction and retaining clients post-sale is as crucial as closing the initial deal, yet often gets neglected due to workload.",
      },
      {
        title: "Sales Strategy and Training",
        heading1: "Strategy Development",
        description1:
          "Crafting a dynamic, data-driven sales strategy involves extensive research and analysis that can stretch team resources thin.",
        heading2: "Ongoing Sales Training",
        description2:
          "Sales teams need to stay updated with the latest techniques and product knowledge, which requires creating and distributing effective training content.",
      },
    ],
  },
  solution: {
    heading: "Wielded for Sales Teams",
    description:
      "For sales teams focused on surpassing revenue targets while enhancing their workflow, Wielded stands out as the transformative tool they need. Our AI-powered productivity solution reshapes the sales landscape, enabling teams to maximize their talents and drive substantial results.",
    workspace: {
      header: "Integrated Sales Workspace",
      description:
        "Wielded offers a shared workspace designed for sales teams to collaborate on lead management, document sharing, and strategy formulation, all within a streamlined and intuitive UI, catalyzing team performance and cohesion.",
    },
    persona: {
      header: "Personalized Sales Personas",
      description:
        "Tap into the power of custom AI personas with Wielded. Tailor unique GPT prompts for different sales contexts—from prospecting scripts to follow-up templates—allowing your team to swiftly navigate through complex sales processes and client interactions with ease.",
    },
    billing: {
      header: "Unified Team Billing",
      description:
        "Our team billing feature simplifies expense management by consolidating all accounts under one invoice, delivering significant savings and administrative ease compared to managing multiple individual tools.",
    },
  },
  persona: {
    heading: "Custom AI Personas Tailored for Sales",
    description:
      "With Wielded's custom personas, sales teams can leverage specialized ChatGPT prompts to expedite routine tasks and maintain focus on their sales pipeline, ensuring a more efficient workplace and a robust bottom line.",
    personas: [
      {
        title: "Lead Generation Expert",
        description:
          "I employ cutting-edge tactics for lead discovery and engagement to ensure a steady pipeline of potential clients.",
      },
      {
        title: "CRM Specialist",
        description:
          "I streamline all CRM activities, from data entry to lead tracking, to optimize our customer relationship efforts.",
      },
      {
        title: "Sales Strategist",
        description:
          "My aim is to develop compelling sales strategies based on data analysis that drives competitive positioning.",
      },
      {
        title: "Client Relationship Manager",
        description:
          "I focus on nurturing long-term client relationships, ensuring continued business and referrals.",
      },
      {
        title: "Sales Analyst",
        description:
          "By analyzing sales trends and data, I provide actionable insights that lead our team to increased success rates.",
      },
      {
        title: "Sales Trainer",
        description:
          "I create and deliver educational programs to keep our sales team at the forefront of industry practices.",
      },
    ],
  },
  cta: {
    heading: "Elevate Your Sales Game with Wielded!",
    subheading: "Unlock exclusive features with your free account today",
    cta: "Explore Wielded",
  },
  faqs: [
    {
      question:
        "How can Wielded benefit a small sales team with limited resources?",
      answer:
        "Wielded's AI-driven platform is built to enhance productivity, making it perfect for teams of all sizes looking to do more with less.",
    },
    {
      question: "Can Wielded help with sales forecasting and trend analysis?",
      answer:
        "Definitely! Wielded's advanced AI capabilities allow for precise forecasting and analysis, helping you stay ahead of market trends.",
    },
    {
      question: "Is there a steep learning curve to start using Wielded?",
      answer:
        "Not at all. We've crafted Wielded with a focus on user-friendliness and provide comprehensive tutorials for a smooth onboarding experience.",
    },
    {
      question:
        "Can we customize Wielded’s AI to fit our specific sales tone and language?",
      answer:
        "Absolutely. Wielded allows for extensive customization of AI responses to align with your brand's tone, language, and sales scripts through the persona feature.",
    },
    {
      question:
        "Is Wielded suitable for sales teams across different industries?",
      answer:
        "Definitely! Wielded is versatile and can be tailored to meet the needs of sales teams across various industries, ensuring industry-specific functionalities are met.",
    },
  ],
};

export default function CaseStudyPage() {
  return (
    <main>
      <CaseStudy caseStudyData={caseStudyData} />
    </main>
  );
}

export const metadata: Metadata = {
  title: caseStudyData.pageTitle,
  description: caseStudyData.solution.description,
};
