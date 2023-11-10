import { CaseStudy, CaseStudyData } from "@/components/CaseStudy";
import { Metadata } from "next";

const caseStudyData: CaseStudyData = {
  idealCustomer: "Educators",
  pageTitle: "Revolutionizing Education with ChatGPT",
  keyChallenges: {
    heading: "Key Challenges for Educators",
    description:
      "Educators are instrumental in shaping the minds of tomorrow, yet they are often encumbered by the weight of their multifaceted roles. This section delves into the prevalent challenges they face, paving the way for a solution that Wielded can provide.\n\nThese challenges are not insurmountable. Wielded offers innovative solutions that empower educators to reclaim their time, enhance student interaction, and foster academic excellence.",
    challenges: [
      {
        title: "Balancing Teaching and Administrative Duties",
        heading1: "Grading and Assessment",
        description1:
          "The need to meticulously grade assignments and provide feedback demands substantial time and often spills over into what little free time educators have left.",
        heading2: "Curriculum Development",
        description2:
          "Constructing and updating syllabi, lesson plans, and materials consumes valuable hours that could otherwise be spent on engaging with students or professional development.",
      },
      {
        title: "Staying Abreast with Technological Advancements",
        heading1: "Learning New Tools",
        description1:
          "The constant evolution of digital tools necessitates educators to upskill, creating an additional layer of responsibility.",
        heading2: "Integrating Tech into Teaching",
        description2:
          "Finding and utilizing the right technology to enhance the learning experience can be a time-consuming process.",
      },
      {
        title: "Research and Collaboration Constraints",
        heading1: "Time for Research",
        description1:
          "Educators value advancing their research but often lack the time due to teaching obligations.",
        heading2: "Academic Collaboration",
        description2:
          "Opportunities for collaboration with peers can be hard to come by, limiting exposure to new perspectives and ideas.",
      },
      {
        title: "Student Support and Mentorship",
        heading1: "Handling Inquiries",
        description1:
          "Personalizing support for a large number of students can be draining on an educator's time and energy.",
        heading2: "Mentoring Students",
        description2:
          "Offering quality mentorship is a rewarding yet time-intensive aspect of an educator's duties.",
      },
    ],
  },
  solution: {
    heading: "Wielded for Educators",
    description:
      "As educators navigate the complexities of their multifaceted roles, Wielded emerges as an indispensable tool designed to elevate their daily routine and alleviate common challenges. Our AI-driven productivity platform transforms how educators approach their work, enabling them to achieve greater efficiency and impact.",
    workspace: {
      header: "Tailored Collaboration Workspaces",
      description:
        "Wielded's shared workspace feature facilitates seamless collaboration with team members. Educators can co-create curriculums, share research materials, and manage administrative tasks together, all within a unified and intuitive interface.",
    },
    persona: {
      header: "Smart Task Switching with Personas",
      description:
        "Wielded equips educators with the ability to tailor custom GPT prompts that suit pedagogical goals. These specialized prompts are a springboard for creating diverse and thought-provoking material—from crafting compelling lecture topics to framing stimulating classroom discussions—each designed to elevate the educational discourse.",
    },
    billing: {
      header: "Simplified Team Billing",
      description:
        "Recognizing budget-sensitive environments, Wielded's team billing empowers educational institutions by providing a streamlined process that consolidates accounts. This innovation not only simplifies administration but also realizes substantial cost benefits compared to the traditional allocation of individual licenses.",
    },
  },
  persona: {
    heading: "Leveraging personas for Educators",
    description:
      "Harnessing custom instructions from ChatGPT, Wielded's personas enable seamless task transitions for educators to adapt their workflows for tasks such as curriculum planning, student assessments, and collaborative research, simplifying diverse academic responsibilities with efficiency.",
    personas: [
      {
        title: "Curriculum Developer",
        description:
          "I’m an educational planner focused on designing relevant and dynamic course syllabi that align with academic standards and student learning outcomes.",
      },
      {
        title: "Grading Assistant",
        description:
          "I handle the assessment of student assignments, ensuring consistent grading standards and providing constructive feedback for improvement.",
      },
      {
        title: "Administrative Coordinator",
        description:
          "I oversee the behind-the-scenes tasks of running a classroom, from attendance tracking to maintaining academic records and reporting.",
      },
      {
        title: "Grant Proposal Writer",
        description:
          "Focused on securing funding for academic projects, I compose compelling grant proposals that underscore the significance and potential impact of our research endeavors.",
      },
      {
        title: "Researcher",
        description:
          "I’m a lifelong learner with a passion for research. I’m constantly exploring new ideas and perspectives to expand my knowledge and advance my field.",
      },
      {
        title: "Mentor",
        description:
          "I’m a mentor to students, providing guidance and support as they navigate their academic journey and prepare for their future careers.",
      },
    ],
  },
  cta: {
    heading: "Take Your Teaching to the Next Level!",
    subheading: "Start with a free account today",
    cta: "Get started",
  },
  faqs: [
    {
      question:
        "Can Wielded's AI handle complex and creative subjects effectively?",
      answer:
        "Absolutely! Our AI is sophisticated and adaptable, capable of handling a range of subject complexities, and can be further tailored to fit specific academic needs.",
    },
    {
      question:
        "Do I lose the personal touch by using AI to provide feedback to students?",
      answer:
        "Not at all. Wielded can be programmed to deliver personalized feedback, maintaining the human element vital to student-educator interactions.",
    },
    {
      question: "Will the use of Wielded increase my workload as an educator?",
      answer:
        "On the contrary, Wielded is designed to reduce your workload by automating and streamlining routine tasks, leaving you more time for critical educational functions.",
    },
    {
      question:
        "Are there training and support available for educators new to Wielded?",
      answer:
        "Yes, we provide comprehensive training materials and ongoing customer support to ensure educators are comfortable and proficient in using Wielded.",
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
