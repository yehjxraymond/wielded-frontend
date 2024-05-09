import { FaqSection } from "@/components/FaqSection";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { FeatureHero } from "@/components/MarketingUI/FeatureHero";
import { FeatureHighlight } from "@/components/MarketingUI/FeatureHighlight";
import { TitleSeparator } from "@/components/MarketingUI/TitleSeparator";
import { PublicLayout } from "@/components/PublicLayout";
import { Metadata } from "next";

const faqs = [
  {
    question: "What is an AI persona, and how does it enhance productivity?",
    answer:
      "An AI persona is akin to a tailored chatbot that holds the context of your specific workflows, preferences, and styles. By storing multiple custom instructions and employing Retrieval-Augmented Generation (RAG), it rapidly adapts to varied tasks, streamlining processes and significantly boosting productivity.",
  },
  {
    question: "How do I create a custom AI chatbot with Persona?",
    answer:
      "Creating a custom AI chatbot with Persona involves selecting the ‘Persona’ feature within Wielded and providing a series of multiple custom instructions that define the context, tone, and behavior you expect. This creates a unique, contextual chatbot ready to tackle specific tasks.",
  },
  {
    question: "Can I switch between different AI personas during my workflow?",
    answer:
      "Yes, switching between multiple AI personas is seamless on Wielded, enabling you to change contexts without losing efficiency. This flexibility allows for diverse task handling without the need to constantly recontextualize.",
  },
  {
    question: "How do I provide background context to my AI persona?",
    answer:
      "Background context can be fed to your AI persona through a simple setup process that involves detailing the nature of tasks, preferred writing style, industry jargon, and specific goals, enhancing the persona’s ability to deliver accurate and context-driven outputs.",
  },
  {
    question:
      "What is Retrieval-Augmented Generation (RAG), and how does Persona use it?",
    answer:
      "Retrieval-Augmented Generation is a method where the AI leverages a vast repository of information to generate precise and informed outputs. Persona uses RAG to reference contextually relevant data, ensuring that the generated content is enriched and accurate.",
  },
  {
    question:
      "How does customizing the output voice benefit my content creation?",
    answer:
      "Customizing the output voice allows your AI persona to create content that aligns with your brand’s tone and style. It ensures consistency across various platforms and resonates better with your target audience.",
  },
  {
    question: "Can I share my AI personas with selected team members?",
    answer:
      "Absolutely, Wielded allows for sharing GPTs with selected team members. This enables unified access to shared AI personas, ensuring cohesiveness in operations and facilitating collaborative efforts.",
  },
  {
    question:
      "How does Wielded ensure the privacy of my company's data when using AI personas?",
    answer:
      "Wielded is designed with stringent security measures, ensuring that all data used to tailor AI personas is kept confidential. Encryption and secure data handling protocols safeguard your company's sensitive information.",
  },
  {
    question:
      "Can I integrate my own data sources with Persona for enhanced output?",
    answer:
      "Yes, you can customize your AI persona by integrating your own data sources. This level of personalization ensures that the outputs from Persona are even more finely tuned and relevant to your specific company’s needs.",
  },
  {
    question: "Are there limitations to the number of personas I can create?",
    answer:
      "Wielded offers the versatility to create an extensive range of personas, eliminating practical limitations. This allows for a broad application across various departments and tasks within your organization.",
  },
  {
    question:
      "How can I fine-tune the chatbot to reflect my business's unique voice and style?",
    answer:
      "Fine-tuning your chatbot is done through iterative refinements of instructions and feedback. By specifying your business’s unique voice and style preferences, the AI persona continually learns and adapts to meet your requirements.",
  },
  {
    question: "What kind of tasks can AI personas perform?",
    answer:
      "AI personas can perform a wide array of tasks, including content writing, coding, customer service, data analysis, and much more. These tasks are guided by the unique information and context specified for each persona.",
  },
  {
    question:
      "How user-friendly is the Persona interface for non-technical users?",
    answer:
      "Wielded’s Persona interface is crafted for ease of use, making it accessible to non-technical users. With a focus on intuitiveness, users can efficiently manage personas without deep technical knowledge.",
  },
  {
    question:
      "Can AI personas be used to automate customer service interactions?",
    answer:
      "Yes, AI personas are capable of automating customer service interactions by handling inquiries, providing information, and resolving issues, thereby enhancing customer support efficiency.",
  },
  {
    question:
      "Can personas perform complex operations, like coding or generating reports?",
    answer:
      "Certainly. Personas have the capacity to execute complex tasks, such as coding and report generation, with precision. These advanced capabilities stem from their ability to understand and implement highly technical instructions.",
  },
  {
    question:
      "Is it possible to train AI personas using company-specific documents?",
    answer:
      "Training AI personas with company-specific documents is possible and encouraged to achieve highly tailored and refined outcomes. This makes the AI personas adept at handling proprietary scenarios and terminologies.",
  },
  {
    question: "How long does it take to set up an AI persona?",
    answer:
      "Setting up an AI persona with Wielded is a swift and straightforward process, typically requiring only a few inputs to start with basic operations, while further refinement can be carried out progressively.",
  },
  {
    question:
      "Can AI personas assist in content brainstorming and idea generation?",
    answer:
      "AI personas are excellent for brainstorming and generating ideas. They can provide fresh perspectives and suggest a plethora of themes, titles, and concepts to help overcome creative blocks.",
  },
  {
    question:
      "What is the process for sharing GPT personas with selected people on my team?",
    answer:
      "Sharing GPT personas with selected team members is streamlined within Wielded. Administrators can assign access rights to team members, enabling them to utilize shared personas while maintaining control.",
  },
  {
    question: "Can individual team members edit and manage shared AI personas?",
    answer:
      "Team members with the appropriate access rights can edit and manage shared AI personas to ensure they remain up-to-date and reflective of current business needs and preferences.",
  },
  {
    question:
      "How do AI personas impact the ROI of content marketing and other business operations?",
    answer:
      "AI personas can significantly boost the ROI of content marketing and business operations by automating time-consuming tasks, ensuring consistent quality, and encouraging innovation, thus freeing up valuable resources for strategic endeavors.",
  },
];

const Content = () => {
  return (
    <PublicLayout>
      <FeatureHero
        heading="Creating Custom AI Chatbots with Personas"
        subheading="Customizable Personas for Every Sector of Your Business — Boost Productivity by 10x with your own AI App Store"
        videoUrl="https://www.youtube-nocookie.com/embed/ir7vMH48flA?si=flhISeW9JzY7WZPN"
        source="persona-feature-introduction"
      />
      <TitleSeparator title="Persona: Your AI-Powered Productivity Partner" />

      <FeatureHighlight
        heading="Craft Your Unique AI Persona"
        subheading="Tailored AI with a Deep Understanding of Your Business Context using Custom Instructions"
        description="Construct your very own AI chatbot, tailored with the specific knowledge and tasks relevant to your business domain, ensuring high relevance and precision in tasks like creating social media content or code snippets."
        imageUrl="/assets/images/persona-light.png"
        imageAlt="Creating a unique AI Persona"
      />

      <FeatureHighlight
        heading="Instant Workflow Transition"
        subheading="Effortless Shift Between Multiple Custom Instructions"
        description="Maximize efficiency by switching between different AI personas for various tasks, with a seamless transition that maintains context and productivity. You can share these 'GPTs' with selected people within the team, ensuring consistent productivity and collaboration among team members."
        imageUrl="/assets/images/wielded-ui-light.png"
        imageAlt="Seamless transition between different AI personas"
      />

      <FeatureHighlight
        heading="Customized Output Voice"
        subheading="Uniform Voice Across All AI Interactions"
        description="Cultivate a unified voice and writing style across all AI-generated content by engraining your organization's signature tone and style into each AI persona. This consistency is crucial in maintaining brand identity, whether the persona is creating blog posts, customer service interactions, or internal communications."
        imageUrl="/assets/images/linkedin-justin-welsh-example.png"
        imageAlt="AI Persona customized output"
      />

      <FeatureHighlight
        heading="Data-Driven Insights with RAG"
        subheading="Intelligent Retrieval-Augmented Generation for Enhanced Outputs"
        description="Harnesses Retrieval-Augmented Generation (RAG) to add a unique edge to decision-making and content creation. By incorporating RAG, your custom AI chatbots can pull in relevant external data during its generative process. The result is a more informed, nuanced, and detail-rich output that not only answers your questions but provides insights that are data-driven and tailored to your business's specific requirements."
        imageUrl="/assets/images/rag-showcase.png"
        imageAlt="RAG in AI personas for data-driven insights"
      />

      <CtaSeparator
        title="10x your productivity with AI Chatbots today."
        subtitle="Empower your team with custom AI personas — Join Wielded Now."
        source="persona-feature-cta"
      />

      <FaqSection faqs={faqs} className="my-10" />
    </PublicLayout>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Creating Custom AI Chatbots with Persona - Wielded",
  description:
    "Experience 10x productivity with Wielded AI personas. Customize chatbots to your business needs, switch tasks seamlessly, and take control of your content's voice and style on a unified AI app store platform.",
};
