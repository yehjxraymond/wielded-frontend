import { FaqSection } from "@/components/FaqSection";
import { HeaderPublic } from "@/components/HeaderPublic";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { FeatureHero } from "@/components/MarketingUI/FeatureHero";
import { FeatureHighlight } from "@/components/MarketingUI/FeatureHighlight";
import { TitleSeparator } from "@/components/MarketingUI/TitleSeparator";
import { Metadata } from "next";

const faqs = [
  {
    question:
      "How can Wielded benefit educators and students in learning about generative AI?",
    answer:
      "Wielded provides an interactive platform that enhances the learning and teaching of generative AI concepts through hands-on experience with ChatGPT and Dall-E 3, fostering deeper understanding and engagement.",
  },
  {
    question:
      "What makes Wielded more suitable for educators compared to individual ChatGPT Plus accounts?",
    answer:
      "Wielded allows for classroom-wide deployments and tailored experiences suited to educational needs, bypassing the restrictions of individual account limits, and enabling efficient classroom management.",
  },
  {
    question: "Is there special OpenAI pricing for educators through Wielded?",
    answer:
      "We are committed to making AI education accessible and offer competitive pricing options for educators. Reach out to us for educational pricing details tailored to your institution’s needs.",
  },
  {
    question:
      "How does Wielded enable educators to deploy multiple ChatGPT accounts for students?",
    answer:
      "With Wielded, educators can effortlessly roll out multiple student accounts through a centralized dashboard, simplifying access for an entire class or course.",
  },
  {
    question: "Can educators share pre-made lesson materials through Wielded?",
    answer:
      "Yes, Wielded supports sharing of sample chats, and AI personas, enabling educators to distribute educational content efficiently and interactively.",
  },
  {
    question:
      "How can custom bots created with Wielded aid in teaching AI concepts?",
    answer:
      "Custom bots allow students to explore and modify AI behavior, offering practical insight into AI's capabilities and decision-making processes through an interactive, custom-fit interface.",
  },
  {
    question:
      "Does Wielded offer a way for students to tweak the AI's behavior for educational purposes?",
    answer:
      "Absolutely, students can use the persona feature to alter the AI’s responses, providing them with a sandbox to understand the nuances of AI interactions and its responsiveness to different prompts.",
  },
  {
    question:
      "What is the process for educators to submit their chatGPT lesson plans to Wielded?",
    answer:
      "Educators can share their lesson plans or teaching ideas directly via our contact form, and our team will collaborate closely to align Wielded’s functionalities with their educational objectives.",
  },
  {
    question:
      "How can educators use Wielded to demonstrate the image generation process with Dall-E?",
    answer:
      "Wielded's interface reveals the dialogue between the user and AI, including the prompts and subsequent AI-generated commands to Dall-E, offering a transparent view into the image generation process.",
  },
  {
    question:
      "Are there any tutorials or guides available for educators to get started with Wielded?",
    answer:
      "Yes, we provide comprehensive tutorials, guides, and customer support to empower educators to fully leverage the capabilities of Wielded in their curriculum.",
  },
  {
    question: "How does Wielded handle student data privacy and security?",
    answer:
      "We adhere to stringent data privacy and security protocols to ensure all student data is safeguarded. Our platform utilizes encryption and secure access controls to maintain the highest data standards.",
  },
  {
    question:
      "What kind of support does Wielded provide to educators implementing AI in their curriculum?",
    answer:
      "Our team offers dedicated support, training materials, and customizable features to ensure Wielded seamlessly integrates into educational settings, simplifying the adoption of AI tools for educators.",
  },
  {
    question:
      "Can students have their own accounts, or are they managed by the educator?",
    answer:
      "Students can have individual accounts for a personalized learning journey, while educators maintain oversight and management capabilities to guide their progress.",
  },
  {
    question:
      "Can Wielded be used to create exams or quizzes that leverage generative AI?",
    answer:
      "Yes, educators can utilize Wielded to craft interactive assessments such as quizzes and exams that make use of AI's generative capabilities, offering a novel evaluation approach.",
  },
  {
    question:
      "How does Wielded ensure the AI-generated content is appropriate for educational settings?",
    answer:
      "Our system includes content filters and moderation tools to ensure that all AI-generated content aligns with educational standards and is appropriate for the classroom environment.",
  },
  {
    question:
      "What are some creative ways educators have used Wielded in their lesson plans?",
    answer:
      "Educators have leveraged Wielded for role-playing historical events with AI personas, interactive storytelling, debate simulations, and even to facilitate learning in language arts and science.",
  },
  {
    question:
      "Can Wielded's AI personas mimic historical figures or authors for educational role-play?",
    answer:
      "Yes, Wielded can create personas that mimic historical figures or authors, providing an immersive role-playing experience in the educational context.",
  },
  {
    question: "How do student accounts work with Wielded's billing system?",
    answer:
      "Wielded offers a streamlined team billing system that allows educational institutions to manage all student accounts under a single billing umbrella, simplifying budgeting and finance management.",
  },
  {
    question:
      "Will students be able to use Dall-E to create images as part of their learning process?",
    answer:
      "Definitely, students can harness the power of Dall-E within Wielded to create high-quality images as part of projects, assignments, or to better understand AI's interpretive visual capabilities.",
  },
  {
    question:
      "Can Wielded facilitate group projects or collaborative assignments using generative AI?",
    answer:
      "Wielded is designed to support collaborative work, enabling students to engage in group projects that make use of generative AI, fostering teamwork and collective problem-solving.",
  },
  {
    question:
      "What instructional resources does Wielded provide to help educators teach AI concepts?",
    answer:
      "Wielded offers a range of instructional resources including lesson templates, curricular guidance, and access to a community of educators to facilitate the teaching of AI concepts.",
  },
  {
    question:
      "Can Wielded's platform be customized to align with different subject matters?",
    answer:
      "Definitely. Wielded's versatility allows it to be aligned with a diverse range of subject matters, enriching any curriculum with the integration of AI.",
  },
  {
    question:
      "How does Wielded address varying levels of student proficiency with AI tools?",
    answer:
      "Our platform offers differentiated learning paths and adaptive instructional materials to accommodate and challenge students at varying levels of AI proficiency.",
  },
  {
    question:
      "What is Wielded's approach to continuous learning and improvement for educators using their platform?",
    answer:
      "Wielded is committed to continuous improvement through regular updates, feature additions, and by incorporating feedback from the educational community to enhance the platform's effectiveness.",
  },
];

const Content = () => {
  return (
    <>
      <HeaderPublic />
      <FeatureHero
        heading="Teaching Generative AI with Wielded"
        subheading="Empower your teaching with instant access to student accounts for ChatGPT and Dall-E 3. Bring OpenAI's most powerful tools into your generative AI classroom."
        videoUrl="https://www.youtube-nocookie.com/embed/3lZb8Wym6tE?si=Xux9dM3Tp6DZl3rM&controls=0"
        source="teaching-generative-ai-educator"
      />
      <TitleSeparator title="Instant AI Classroom Environment for Classes of All Sizes" />
      <FeatureHighlight
        heading="Easy Account Deployment for Classes"
        subheading="Bypass the constraints of multiple ChatGPT Plus accounts"
        description="Eliminate the hurdles linked with the procurement of individual ChatGPT Plus accounts for your classroom. Deploy Wielded's educational accounts to your students effortlessly. Create an inclusive learning environment with openai pricing tailored for educators."
        imageUrl="/assets/images/members-settings-light.png"
        imageAlt="Effortless deployment of student accounts with Wielded"
      />
      <FeatureHighlight
        heading="All-in-One Teaching Suite"
        subheading="Every feature a teacher needs for generative AI classes"
        description="Wielded is the only generative AI environment you need for your classroom, offering every feature an educator requires for teaching generative AI concepts. With access to cutting-edge AI models such as GPT-3.5, GPT-4, and Dall-E 3, teachers can craft lessons that delve into the inner workings of AI, fostering a hands-on learning experience that prepares students for the future of technology."
        imageUrl="/assets/images/dalle-3-gallery.png"
        imageAlt="Comprehensive teaching suite with Wielded"
      />
      <FeatureHighlight
        heading="Custom Bot Creation with Persona"
        subheading="Craft AI experiences unique to your curriculum"
        description="Fuel your classroom's understanding of AI with the creation of custom bots. Challenge your students with bots crafted to evoke critical thinking, understand complex AI decision pathways, and encourage practical problem-solving scenarios. Dive into the AI mechanics with your students by creating custom personas within Wielded."
        imageUrl="/assets/images/gpt-bots-for-educators.png"
        imageAlt="Custom bot creation aiding in teaching AI concepts"
      />
      <FeatureHighlight
        heading="Transparent AI Mechanisms"
        subheading="Visualize the AI thought process"
        description="Go beyond theoretical lessons and allow learners to visualize the AI's decision-making processes with Wielded's transparent AI mechanisms. As students engage with Dall-E, they gain a front-row seat to the fascinating interchange between prompt, context, and generated output. This insight sheds light on the complex patterns AI uses to interpret and respond to user instructions, demystifying AI behaviors and fostering a deeper, conceptual understanding among students."
        imageUrl="/assets/images/dalle-3-detailed-prompt-controls.png"
        imageAlt="Revealing the AI's thought process to students"
      />
      <CtaSeparator
        title="Transform AI Education with Wielded"
        subtitle="Curious how to use Wielded for your teaching plans? Let's tailor a lesson plan for your classroom needs."
        source="chatgpt-student-accounts"
      />
      <FaqSection faqs={faqs} className="my-10" />
    </>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Teaching Generative AI with Wielded - Empower Every Classroom",
  description:
    "Discover how Wielded can transform your teaching workflow with instant access to ChatGPT and Dall-E 3, facilitating an interactive and engaging learning environment.",
};
