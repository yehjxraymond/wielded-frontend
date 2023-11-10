import { CaseStudy, CaseStudyData } from "@/components/CaseStudy";
import { Metadata } from "next";

const caseStudyData: CaseStudyData = {
  idealCustomer: "Customer Support Teams",
  pageTitle: "Elevating Customer Support with AI Efficiency",
  keyChallenges: {
    heading: "Key Challenges for Customer Support Teams",
    description:
      "Customer Support Teams are on the front lines of service delivery, handling an array of challenges ranging from high ticket volumes to maintaining a high standard of customer satisfaction. Addressing these issues efficiently is paramount for success in this demanding field.\n\nOvercome the obstacles with a transformative answer—Wielded can raise the bar for support teams across the board.",
    challenges: [
      {
        title: "Ticket Triage and Response Time Optimization",
        heading1: "Managing High Volumes",
        description1:
          "Sifting through a sea of support tickets, prioritizing them and responding in a timely manner is a constant struggle for support teams.",
        heading2: "Ensuring Rapid Availability",
        description2:
          "Customers expect immediate assistance, and support teams strive to provide fast and efficient service to maintain satisfaction.",
      },
      {
        title: "Uniform Quality and Personalization",
        heading1: "Consistency Across Team",
        description1:
          "Delivering uniform quality in responses and maintaining a personalized touch in each interaction challenges support teams to perform at their best at all times.",
        heading2: "Adapting to Customer Needs",
        description2:
          "Adapting support strategies to meet the diverse needs of customers while managing resources effectively.",
      },
      {
        title: "Adoption of New Technologies",
        heading1: "Integrating Multiple Systems",
        description1:
          "Support teams often grapple with the integration of various tools and technologies, striving for synergy and a stream-lined workflow.",
        heading2: "Upkeep of Systems and Tools",
        description2:
          "Keeping up with updates and training on new technologies eats into the productivity of support staff.",
      },
      {
        title: "Training and Development",
        heading1: "Continuous Team Education",
        description1:
          "Keeping customer support teams up-to-date with product changes and new support methodologies is a continual process requiring efficient training systems.",
        heading2: "Performance Evaluation and Improvement",
        description2:
          "Regularly evaluating support team performance and creating targeted improvement plans is essential for maintaining high-quality support.",
      },
    ],
  },
  solution: {
    heading: "Wielded for Customer Support Teams",
    description:
      "Wielded provides the next-generation platform, especially designed for the needs of Customer Support Teams. By leveraging AI-driven tools and a collaborative workspace, we empower teams to excel in their service delivery and exceed customer expectations.",
    workspace: {
      header: "A Unified Workspace",
      description:
        "Our shared workspace offers impeccable coordination within teams and with other departments, aligning tasks and conversations to ensure a consistent support experience.",
    },
    persona: {
      header: "Custom AI Personas for Varied Support Scenarios",
      description:
        "Tailored personas equipped with specific prompts revamp the way Customer Support Teams approach recurring queries, enabling them to switch from one support scenario to another with assured efficiency and personalization.",
    },
    billing: {
      header: "Streamlined Team Billing",
      description:
        "Wielded caters to the financial frameworks of businesses by offering a team billing feature, enabling straightforward account management and significant savings over individual subscriptions.",
    },
  },
  persona: {
    heading: "Harnessing Personas for Customer Support Teams",
    description:
      "Create profiles with custom instructions that resonate with typical support scenarios, allowing team members to swiftly adapt to different customer interactions and maintain a high standard of quality support.",
    personas: [
      {
        title: "Customer Advocate",
        description:
          "I excel in understanding and empathizing with customer concerns, providing solutions that not only solve their issues but also exceed their service expectations.",
      },
      {
        title: "Technical Support Specialist",
        description:
          "I specialize in handling technical queries, translating complex jargon into customer-friendly language, and guiding them through troubleshooting procedures with ease.",
      },
      {
        title: "Quality Assurance Analyst",
        description:
          "I am committed to upholding high service standards, analyzing response quality, and providing insights to maintain and improve our support system.",
      },
      {
        title: "Knowledge Base Curator",
        description:
          "Focused on maintaining up-to-date and helpful resources, I manage our knowledge base to ensure customers and team members have access to accurate information.",
      },
    ],
  },
  cta: {
    heading: "Transform Your Customer Support Experience",
    subheading: "Join the revolution with a free Wielded account.",
    cta: "Elevate Support Now",
  },
  faqs: [
    {
      question:
        "How does the Wielded AI platform ensure personalized customer interactions?",
      answer:
        "Wielded's AI platform is designed to understand various customer nuances and can be customized to address specific support needs, ensuring a highly personalized experience.",
    },
    {
      question:
        "Can Wielded integrate with our existing support ticketing system?",
      answer:
        "Yes, Wielded is built to work alongside your existing systems and tools. Have Wielded on the side to provide AI-powered support, while your team continues to use your existing ticketing system.",
    },
    {
      question:
        "Is there support available for our team as we integrate and use Wielded?",
      answer:
        "Absolutely! We offer a comprehensive resource library and dedicated customer support to ensure your team is fully equipped to leverage Wielded's capabilities.",
    },
    {
      question:
        "Does Wielded's AI platform require technical expertise to operate?",
      answer:
        "No, Wielded is designed to be user-friendly and accessible. It offers intuitive interfaces and guidance so that individuals without technical backgrounds can easily operate the platform.",
    },
    {
      question: "Is Wielded scalable for growing customer support teams?",
      answer:
        "Wielded has been built with scalability in mind, making it suitable for support teams of all sizes. It has the capability to handle increased workloads and additional users without performance degradation.",
    },
    {
      question:
        "How does Wielded handle different languages and cultural contexts in customer support?",
      answer:
        "Wielded is equipped with advanced language processing capabilities and can be customized to cater to various languages and cultural contexts, providing relevant and sensitive customer support experiences.",
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
