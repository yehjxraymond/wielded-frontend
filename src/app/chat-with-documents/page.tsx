import { FaqSection } from "@/components/FaqSection";
import { HeaderPublic } from "@/components/HeaderPublic";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { FeatureHero } from "@/components/MarketingUI/FeatureHero";
import { FeatureHighlight } from "@/components/MarketingUI/FeatureHighlight";
import { TitleSeparator } from "@/components/MarketingUI/TitleSeparator";
import { Metadata } from "next";

const faqs = [
  {
    question: "Can Wielded analyze any type of document?",
    answer:
      "Wielded is versatile in handling various types of documents including text files, reports, contracts, and more, allowing teams to gain insights from a wide range of sources.",
  },
  {
    question:
      "How does Wielded ensure the security and confidentiality of uploaded documents?",
    answer:
      "Security is a top priority for Wielded. Uploaded documents are transferred over secure connections and are stored using encryption. Access is strictly controlled, ensuring that only authorized team members can view and analyze documents.",
  },
  {
    question:
      "What file formats are supported by Wielded's document analysis feature?",
    answer:
      "Our document analysis feature supports popular formats such as DOCX, PDF, TXT, catering to a wide range of business needs.",
  },
  {
    question: "Can Wielded extract specific information from large documents?",
    answer:
      "Yes, Wielded is capable of pinpointing and extracting particular pieces of information from extensive documents, saving time and streamlining workflow for teams.",
  },
  {
    question: "How does the chat interface interact with uploaded documents?",
    answer:
      "The chat interface simplifies interaction by allowing users to ask direct questions about the document's content, facilitating an intuitive and conversational way to access information within documents.",
  },
  {
    question: "Is there a limit to the size of the document I can upload?",
    answer:
      "We've optimized Wielded to handle large documents up to 25MB each. These limits are designed to accommodate common business and technical documents efficiently.",
  },
  {
    question: "How accurate is Wielded's document analysis?",
    answer:
      "Wielded leverages ChatGPT and Claude models to deliver high-accuracy analysis. The tool continuously improves as it learns from more data, offering dependable results for document analysis. The accuracy of the document analysis will improve over time as better models are released.",
  },
  {
    question: "Can Wielded summarize entire documents?",
    answer:
      "Yes, Wielded can create concise and coherent summaries of entire documents, perfect for quick reviews and keeping teams aligned with the key points.",
  },
  {
    question: "How can I share the analyzed results with my team members?",
    answer:
      "You can easily share the chat directly in use the share conversation feature",
  },
  {
    question:
      "Are there any industry-specific versions of Wielded for document analysis?",
    answer:
      "You may fine-tune the output by utilizing industry specific personas. For example, you can create a legal persona to analyze legal documents.",
  },
  {
    question: "How can legal professionals use Wielded for contract analysis?",
    answer:
      "Legal professionals can utilize Wielded to quickly parse through contracts, extract key clauses, and assess obligations and stipulations efficiently, streamlining the contract review process.",
  },
  {
    question:
      "In what ways can educators leverage Wielded for creating learning materials?",
    answer:
      "Educators can use Wielded to analyze educational content, pull out critical learning points, and craft customized teaching materials that resonate with their curriculum and teaching style.",
  },
  {
    question:
      "How does Wielded enhance the document review process for researchers?",
    answer:
      "For researchers, Wielded streamlines the review process by offering efficient information extraction, summarization, and the capacity to rapidly identify pertinent research citations and datasets.",
  },
  {
    question: "Can I use Wielded to analyze non-English documents?",
    answer:
      "Wielded's AI has multilingual capabilities, allowing for the analysis of documents in various languages, although non-English features may vary based on language complexity and AI training data.",
  },
  {
    question: "How fast does Wielded process and analyze uploaded documents?",
    answer:
      "Wielded's processing speed is optimized for efficiency, with most documents analyzed within seconds, depending on size and complexity.",
  },
  {
    question: "Can developers use Wielded to understand and refactor code?",
    answer:
      "Yes, developers can use Wielded for code review and refactoring suggestions, utilizing the tool to understand complex codebases and improve code quality.",
  },
  {
    question: "What happens to my uploaded documents after analysis?",
    answer:
      "After analysis, documents can be securely stored in Wielded or removed as per user preference. We respect user data policies and provide options for data handling.",
  },
  {
    question: "Can Wielded generate executive summaries of business reports?",
    answer:
      "Absolutely. Wielded can distill expansive business reports into executive summaries, highlighting key insights and decisions for leadership and stakeholders.",
  },
  {
    question: "How user-friendly is the Wielded document chat interface?",
    answer:
      "Designed with a focus on user experience, the Wielded chat interface is intuitive, making document interaction natural and accessible for users of all technical levels.",
  },
  {
    question: "Can Wielded detect and analyze tables and graphs in a document?",
    answer:
      "Wielded is only capable of dealing with text information for now. It will not be able read information from tables and graphs if they are presented as an image.",
  },
  {
    question: "How does Wielded handle complex documents with multiple topics?",
    answer:
      "Wielded's AI can navigate complex documents, sort information by topics, and provide focused analyses on specific sections to simplify multi-faceted documents.",
  },
  {
    question:
      "What are the main benefits of using Wielded for document analysis over traditional methods?",
    answer:
      "Wielded offers speed, accuracy, and a level of depth that traditional methods cannot match, alongside collaborative tools that facilitate shared understanding and decision-making across teams.",
  },
  {
    question: "Is there a way to customize the analysis performed by Wielded?",
    answer:
      "Certainly, users can tweak Wielded's analysis parameters to meet specific needs, ensuring that the output aligns with team objectives and preferences.",
  },
  {
    question:
      "How do you ensure the continual improvement of Wielded's AI analysis capabilities?",
    answer:
      "We employ a cycle of continuous feedback and model training, which includes user input, to perpetually enhance the precision and functionality of Wielded's AI.",
  },
  {
    question: "Can Wielded help in drafting documents based on the analysis?",
    answer:
      "Wielded is not just for analysis; it can also assist in drafting documents, offering suggestions and generating content based on the analysis provided.",
  },
  {
    question:
      "How can marketers utilize Wielded for analyzing industry research reports?",
    answer:
      "Marketers can use Wielded to dissect industry reports, extract relevant trends and data, and inform strategies or content creation based on actionable insights.",
  },
];

const Content = () => {
  return (
    <>
      <HeaderPublic />
      <FeatureHero
        heading="Empower Decision-Making with AI-Powered Document Analysis"
        subheading="Upload, Chat, Discover – Enhance your data comprehension and unlock actionable insights from documents effortlessly."
        videoUrl="https://www.youtube-nocookie.com/embed/3lZb8Wym6tE?si=Xux9dM3Tp6DZl3rM&controls=0"
        source="chat-with-documents"
      />
      <TitleSeparator title="Leverage Data with Next-Generation AI Tools" />
      <FeatureHighlight
        heading="Elevate Educational Content"
        subheading="Transform Teaching and Learning Experiences"
        description="Utilize Wielded to translate complex educational literature into straightforward study aids. Create engaging, interactive quizzes and summaries with a few simple steps, using the power of AI using models like ChatGPT 4 and Claude v2.1."
        imageUrl="/assets/images/course-outline-generation.png"
        imageAlt="AI making educational content more accessible"
      />
      <FeatureHighlight
        heading="Accelerate Legal Reviews"
        subheading="Innovate Legal Document Handling"
        description="Save hours on legal document review and analysis. With Wielded, gain the capability to instantaneously identify and revise key contractual terms and negotiation points, revolutionizing the legal field's document management. "
        imageUrl="/assets/images/legal-review-chatgpt.png"
        imageAlt="AI facilitating faster review of legal documentation"
      />
      <FeatureHighlight
        heading="Revitalize Legacy Code"
        subheading="Modernize Your Codebase Intelligently"
        description="Breathe new life into outdated code. Wielded's, powered by OpenAI and Anthropic, assists in interpreting, debugging, and re-writing legacy code, paving the way for its seamless integration into contemporary frameworks and systems."
        imageUrl="/assets/images/chatgpt-refactoring-code-file.png"
        imageAlt="AI assisting with understanding and updating legacy code"
      />
      <FeatureHighlight
        heading="Extract Academic Essentials"
        subheading="Redefine Academic Research"
        description="Dramatically simplify the process of academic research with Wielded, by condensing extensive papers into digestible summaries. Identify crucial information, compare findings, and build upon the collective knowledge with unprecedented efficiency."
        imageUrl="/assets/images/chatgpt-for-research-journal.png"
        imageAlt="AI summarizing and synthesizing academic research"
      />
      <CtaSeparator
        title="Transform the way you interact with documents."
        subtitle="Elevate your team's productivity—sign up now or book a personalized demonstration."
        source="chat-with-documents"
      />
      <FaqSection faqs={faqs} className="my-10" />
    </>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Advanced AI Document Analysis for Enhanced Productivity | Wielded",
  description:
    "Maximize efficiency and discover key insights with Wielded. Our AI-driven document analysis tools are designed to streamline educational, legal, and research practices. Get started today to see how Wielded can revolutionize your document workflow.",
  keywords:
    "AI Document Analysis, Productivity Tools, Educational AI, Legal Review AI, Legacy Code AI, Research Summarization",
};
