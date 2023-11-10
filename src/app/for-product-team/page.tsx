import { CaseStudy, CaseStudyData } from "@/components/CaseStudy";
import { Metadata } from "next";

const caseStudyData: CaseStudyData = {
  idealCustomer: "Product Teams",
  pageTitle: "Supercharge Your Product Development with Wielded",
  keyChallenges: {
    heading: "Key Challenges for Product Teams",
    description:
      "Transforming vision into reality, product teams grapple with the high demands of innovation amidst complex coordination and communication challenges. Unveil the prevailing hurdles hindering the path to crafting market-defining products.",
    challenges: [
      {
        title: "Feature Prioritization and Roadmapping",
        heading1: "Decision Overload",
        description1:
          "Navigating the sea of customer feedback and market trends to determine the most impactful product features is often overwhelming.",
        heading2: "Product Vision Alignment",
        description2:
          "Ensuring every team member has a unified view of the product's roadmap often requires significant effort and time.",
      },
      {
        title: "Effective Cross-Functional Alignment",
        heading1: "Synchronizing Teams",
        description1:
          "Aligning the objectives and deliverables across design, development, marketing, and sales teams can become a logistical nightmare.",
        heading2: "Communication Gaps",
        description2:
          "Disparate tools and processes often lead to siloed information and miscommunication.",
      },
      {
        title: "Managing Customer Feedback and Expectations",
        heading1: "Overwhelming Feedback",
        description1:
          "Sifting through copious amounts of user feedback to extract actionable insights can be a daunting task, leading to priority paralysis.",
        heading2: "Meeting Expectations",
        description2:
          "Balancing the development of new features while maintaining existing functionality can strain teams and disappoint users when not handled optimally.",
      },
      {
        title: "Adaptability to Market Changes",
        heading1: "Staying Ahead of Trends",
        description1:
          "The market evolves rapidly, and product teams must be equipped to pivot strategy and adapt product offerings in response to emerging trends and technologies.",
        heading2: "Customer-Centric Development",
        description2:
          "Focusing on a customer-centric approach requires the ability to incorporate user feedback into the development loop without disrupting the overall product strategy.",
      },
    ],
  },
  solution: {
    heading: "Wielded for Product Teams",
    description:
      "Wielded serves as the cornerstone for product teams aiming to streamline their workflow and foster a culture of efficiency and innovation. Dive into the features that make Wielded an unrivaled partner in the product development journey.",
    workspace: {
      header: "Unified Collaboration Workspaces",
      description:
        "Wielded's collaborative workspaces provide the perfect environment for product teams to synergize, brainstorm, and remain aligned on their goals—propelling product development with agility and precision.",
    },
    persona: {
      header: "Context-Sensitive AI Personas",
      description:
        "Transition effortlessly between diverse product tasks with Wielded's personas, from backlog grooming to UX analytics, ensuring that every aspect of product development receives the focus it needs.",
    },
    billing: {
      header: "Consolidated Team Billing",
      description:
        "Embrace simplicity and cost-effectiveness with Wielded's team billing option, which gives product teams the advantage of streamlined administration and budgeting without the burden of multiple accounts.",
    },
  },
  persona: {
    heading: "Empowering Product Teams with Custom AI Personas",
    description:
      "Tailored prompts and personas on Wielded adapt to the unique requirements of product tasks, enabling quick context shifting and enhanced productivity for your product team's multifarious responsibilities.",
    personas: [
      {
        title: "Feature Analyst",
        description:
          "I specialize in analyzing customer feedback and market data to recommend feature prioritization for the product roadmap.",
      },
      {
        title: "Agile Coordinator",
        description:
          "Facilitating agile ceremonies, I ensure sprint planning, and backlog management are executed with efficiency and clarity.",
      },
      {
        title: "UX Researcher",
        description:
          "My focus lies in understanding user behavior, A/B testing, and usability studies to guide UX improvements.",
      },
      {
        title: "Product Liaison",
        description:
          "I bridge the communication gap between all stakeholders to maintain clear, consistent product narratives and expectations.",
      },
      {
        title: "Release Manager",
        description:
          "Coordinating with cross-functional teams, I oversee the release schedule and launch plans to ensure timely delivery of product features.",
      },
      {
        title: "Quality Analyst",
        description:
          "I am dedicated to upholding product standards, managing test plans and ensuring every release meets our rigorous quality benchmarks.",
      },
      // Additional personas can be listed here.
    ],
  },
  cta: {
    heading: "Elevate Your Product Team's Potential",
    subheading:
      "Unlock the full suite of Wielded's features with a free account",
    cta: "Join the Wielded Revolution",
  },
  faqs: [
    {
      question:
        "How does Wielded integrate with my existing product management tools?",
      answer:
        "Wielded is designed to seamlessly integrate with popular product management platforms, enhancing your existing workflows with AI-driven insights and collaboration features.",
    },
    {
      question: "Can personas in Wielded handle technical product tasks?",
      answer:
        "Absolutely, our personas can be tailored to tackle technical tasks, from analyzing source code for potential improvements to documenting technical specifications efficiently.",
    },
    {
      question: "What kind of support does Wielded offer for product teams?",
      answer:
        "We provide dedicated support channels, extensive documentation, and training materials to help product teams make the most out of Wielded's capabilities.",
    },
    {
      question:
        "How can Wielded address our concerns about adopting new software?",
      answer:
        "Our intuitive interface and onboarding process are designed to get teams started with minimal friction, and our customer support team is always ready to help with any questions.",
    },
    {
      question: "Can Wielded help in managing stakeholder expectations?",
      answer:
        "Yes, with Wielded's collaborative features and AI-driven analytics, you can keep stakeholders informed with real-time updates, ensuring expectations are managed effectively.",
    },
    {
      question:
        "Is it possible to customize the AI to our specific product niche?",
      answer:
        "Absolutely, Wielded's AI can be customized with tailored prompts to better understand and assist with tasks unique to your product niche.",
    },
    {
      question:
        "In what ways can Wielded support agile and scrum methodologies?",
      answer:
        "Wielded complements agile and scrum practices by offering tools for sprint planning, backlog grooming, and retrospective analysis, all enhanced by AI.",
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
