import { FaqSection } from "@/components/FaqSection";
import { HeaderPublic } from "@/components/HeaderPublic";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { FeatureHero } from "@/components/MarketingUI/FeatureHero";
import { FeatureHighlight } from "@/components/MarketingUI/FeatureHighlight";
import { TitleSeparator } from "@/components/MarketingUI/TitleSeparator";
import { PublicLayout } from "@/components/PublicLayout";
import { Metadata } from "next";

const faqs = [
  {
    question: "How do I access the different AI models available in Wielded?",
    answer:
      "Educators and students can simply log into their Wielded account, and select integrations from a range of AI models including GPT-3.5, GPT-4, Claude Instant 1.2, and future AI models as they become available.",
  },
  {
    question: "Can schools use their cloud credits for accessing AI models?",
    answer:
      "Yes, educational institutions that have received Azure or AWS credits can take advantage of these for accessing GPT and Claude models respectively, enabling a cost-effective learning opportunity.",
  },
  {
    question: "What measures are in place to ensure the privacy of our data?",
    answer:
      "Amazon Bedrock and Azure OpenAI prioritize your data's privacy, making sure it is not shared with or accessible by the model providers, or used to enhance any outside AI models or services.",
  },
  {
    question: "What is Wielded and how is it used in the education sector?",
    answer:
      "Wielded is an AI productivity tool that integrates with various foundation AI models, enhancing educational workflows by providing an interactive laboratory where students can learn and compare AI behaviors and prompting techniques.",
  },
  {
    question: "Which AI models are currently supported by Wielded?",
    answer:
      "Wielded currently supports multiple AI models including OpenAI's GPT-3.5, GPT-4, and Anthropic's Claude Instant 1.2 and 2.1, with plans to expand our model offerings in the future.",
  },
  {
    question:
      "Can students compare different AI models in real-time with Wielded?",
    answer:
      "Yes, students can access and interact with various AI models side by side in real-time, allowing for comparative learning and understanding of each model's unique capabilities.",
  },
  {
    question: "How can educators use Wielded in their curriculum?",
    answer:
      "Educators can integrate Wielded into their curriculum by creating AI-driven assignments, facilitating modern research practices, and enabling experimentation with AI for various subjects, all within a controlled and educational setting.",
  },
  {
    question:
      "What are the learning outcomes associated with using Wielded in the classroom?",
    answer:
      "Using Wielded in the classroom can enhance digital literacy, critical thinking skills, and an understanding of AI technology and its applications in real-world scenarios.",
  },
  {
    question:
      "How does Wielded help students learn different prompting techniques for AI models?",
    answer:
      "Wielded offers a hands-on experience with various AI models, allowing students to experiment with and refine their prompting techniques to achieve the best results and understand how different models respond.",
  },
  {
    question:
      "What are the advantages of using GPT-4 for brainstorming in an educational setting?",
    answer:
      "GPT-4 offers advanced language understanding and creativity, making it ideal for brainstorming sessions and enhancing students' analytical and innovative thinking skills.",
  },
  {
    question:
      "Why is Claude 2.1 preferred for generating reports and written content in schools?",
    answer:
      "Claude 2.1 provides outputs with a unique linguistic style that mimics human-like writing, making it suitable for generating coherent reports and written content without the typical 'AI-voice'.",
  },
  {
    question:
      "How can educational institutes leverage Azure or AWS credits with Wielded?",
    answer:
      "Educational institutions with Azure or AWS credits can use them to access AI models integrated in Wielded, potentially reducing or even eliminating the cost barrier to advanced AI tools for educational purposes.",
  },
  {
    question:
      "What are the privacy measures Wielded takes when working with educational data?",
    answer:
      "Wielded implements stringent privacy measures, ensuring data is controlled and operated securely without sharing with third-party providers, adhering to privacy laws and institution policies.",
  },
  {
    question:
      "How are prompts and outputs managed to ensure privacy with Wielded?",
    answer:
      "Prompts and outputs are managed within a private and secure environment, meaning they are not shared with model providers or used to improve other services without explicit permission.",
  },
  {
    question:
      "How does Wielded ensure the security of sensitive educational data?",
    answer:
      "Wielded incorporates advanced security measures to protect sensitive educational data, including encryption, controlled access, and strict adherence to data protection regulations.",
  },
  {
    question:
      "What are the costs associated with using Wielded for educational institutions?",
    answer:
      "Besides the model cost incurred on the foundation model provider end, institutes will be charged for the seats they purchase on Wielded. Visit our pricing page for more details or contact us for a customized plan.",
  },
  {
    question:
      "Does Wielded offer any educational discounts or special pricing for schools?",
    answer:
      "Wielded often provides educational discounts or customized pricing plans for schools and educational institutions to ensure affordability and accessibility. Contact us for more information.",
  },
  {
    question:
      "How can teachers monitor students' usage and progress within Wielded?",
    answer:
      "Teachers can utilize Wielded's tracking and reporting features to monitor students' engagement and progress, providing insights to inform instructional strategies.",
  },
  {
    question:
      "Can Wielded facilitate project-based learning or collaborative assignments?",
    answer:
      "Absolutely, Wielded encourages project-based learning and supports collaborative assignments by allowing students to work together with AI models in shared workspaces.",
  },
  {
    question:
      "Is any training provided for educators to effectively use Wielded in their teaching?",
    answer:
      "Wielded provides instructional materials and training sessions for educators to become adept at using the platform and to integrate it effectively into their teaching methods. Contact us to discuss your needs.",
  },
  {
    question:
      "What technical requirements are needed to integrate Wielded within our institution?",
    answer:
      "Wielded typically requires internet access and compatibility with modern web browsers. Detailed technical requirements will be provided to ensure smooth integration with institutional IT systems.",
  },
  {
    question: "How can Wielded be used to enhance remote learning experiences?",
    answer:
      "Wielded offers interactive AI tools that can be accessed from anywhere, enhancing the remote learning experience by making educational content more engaging and interactive.",
  },
  {
    question:
      "Can students’ work on Wielded be exported for assessment purposes?",
    answer:
      "Work completed on Wielded can be easily exported in various formats, allowing educators to assess and provide feedback on students' AI-assisted projects.",
  },
  {
    question:
      "Are there any age restrictions or content filters in place within Wielded?",
    answer:
      "Content filter for the models can be customized on either the Microsoft Azure OpenAI portal or the AWS Bedrock console.",
  },
  {
    question: "How does Wielded handle updates and new features?",
    answer:
      "Wielded is continuously improved with new features and updates, which are communicated to users and rolled out in a manner that minimizes disruption to the educational process.",
  },
  {
    question: "Can Wielded be accessed from mobile devices and tablets?",
    answer:
      "Yes, Wielded is designed to be accessible from a variety of devices including mobile phones and tablets, ensuring flexibility and convenience for users.",
  },
  {
    question:
      "What support is available for institutions facing issues with Wielded?",
    answer:
      "Wielded offers dedicated support for educational institutions, including customer service, technical assistance, and troubleshooting guidance.",
  },
  {
    question:
      "How does Wielded contribute to the development of digital literacy skills?",
    answer:
      "By integrating AI into the learning environment, Wielded helps students develop digital literacy skills that are crucial for navigating the modern world and future workplaces.",
  },
];

const Content = () => {
  return (
    <PublicLayout>
      <FeatureHero
        heading="Multi-Model AI Education With Wielded"
        subheading="Discover a world of AI for education with an array of foundational AI models to enhance learning."
        videoUrl="https://www.youtube-nocookie.com/embed/N3r930pFR8s?si=_eC_ylBIbB1ZvcUA&controls=0"
        source="multi-model-ai-education"
      />
      <TitleSeparator title="Exploratory AI Learning for Modern Education" />
      <FeatureHighlight
        heading="Diverse AI Laboratory"
        subheading="Engage with Multiple AI Models for Comprehensive Learning"
        description="Invite students into the AI frontier with access to an array of models like GPT-3.5, GPT-4, Claude Instant 1.2, and more on the horizon. Understand the nuances of different AI capabilities and prompting techniques in a controlled, educational environment, fostering a rich learning experience."
        imageUrl="/assets/images/ChatGPT-interface-azure-openai-aws-bedrock.png"
        imageAlt="ChatGPT interface with Azure OpenAI and AWS Bedrock"
      />
      <FeatureHighlight
        heading="Strategic Model Selection"
        subheading="Optimize the Learning Experience with Specific AI Strengths"
        description="Tailor education by choosing the right AI model for each task. Utilize GPT-4's creative ingenuity for brainstorming and content analysis, while tapping into Claude 2.1's unique linguistic style for generating reports and persuasive writing without the 'AI-voice'. Promote critical thinking by comparing outputs and uncovering each model's distinct advantages."
        imageUrl="/assets/images/selecting-different-ai-model-chatgpt.png"
        imageAlt="Selecting different AI models in ChatGPT"
      />
      <FeatureHighlight
        heading="Benefit from Cloud Credits"
        subheading="Maximize Educational Resources through Cloud Credit Utilization"
        description="Empower your educational program by leveraging existing Azure and AWS cloud credits. Access GPT and Claude models through recognized cloud services, enabling a cost-effective venue for AI exploration and learning without financial constraints."
        imageUrl="/assets/images/free-azure-openai-claude-credits.png"
        imageAlt="Using cloud credits for accessing AI models"
      />
      <FeatureHighlight
        heading="Data Privacy and Control"
        subheading="Your Data, Your Privacy - Uncompromised"
        description="Wielded stands firmly on the principle of data sovereignty. Educators and students can experiment with AI knowing their data stays private. With Amazon Bedrock and Azure OpenAI, you tune models on a private copy, ensuring inputs, outputs, and training data are not shared with model providers or used in ways you haven't explicitly authorized."
        imageUrl="/assets/images/azure-aws-bedrock-ai-data-privacy.png"
        imageAlt="Data privacy with Azure OpenAI and AWS Bedrock"
      />
      <CtaSeparator
        title="Experience the next level of AI in education with Wielded."
        subtitle="Sign up for an educational account or book a demo today."
        source="multi-model-ai-education-cta"
      />
      <FaqSection faqs={faqs} className="my-10" />
    </PublicLayout>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Multi-Model AI for Education - Wielded",
  description:
    "Wielded introduces a multi-model AI platform for educators and students. Explore diverse AI models and prompting techniques, with the assurance of data privacy and cloud credit utilization.",
};
