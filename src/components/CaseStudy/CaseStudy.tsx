"use client";
import { HeaderPublic } from "@/components/HeaderPublic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { FunctionComponent } from "react";
import { PersonaGallery } from "../ChatInterface/PersonaSelector";
import { Button } from "../ui/button";

export interface CaseStudyData {
  idealCustomer: string;
  pageTitle: string;
  keyChallenges: {
    heading: string;
    description: string;
    challenges: {
      title: string;
      heading1: string;
      description1: string;
      heading2: string;
      description2: string;
    }[];
  };
  solution: {
    heading: string;
    description: string;
    workspace: {
      header: string;
      description: string;
    };
    persona: {
      header: string;
      description: string;
    };
    billing: {
      header: string;
      description: string;
    };
  };
  persona: {
    heading: string;
    description: string;
    personas: {
      title: string;
      description: string;
    }[];
  };
  cta: {
    heading: string;
    subheading: string;
    cta: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const CaseStudy: FunctionComponent<{ caseStudyData: CaseStudyData }> = ({
  caseStudyData,
}) => {
  return (
    <>
      <HeaderPublic />
      {/* Header */}
      <div className="container">
        <div className="font-semibold tracking-tight">
          For {caseStudyData.idealCustomer}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {caseStudyData.pageTitle}
        </h1>
      </div>
      {/* Key Challenges */}
      <div className="container lg:flex my-24 gap-4">
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4 tracking-tight">
            {caseStudyData.keyChallenges.heading}
          </h2>
          <div className="whitespace-pre-line space-y-2">
            {caseStudyData.keyChallenges.description}
          </div>
        </div>
        <div className="lg:w-2/3 grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-20 mt-12 lg:mt-0">
          {caseStudyData.keyChallenges.challenges.map((challenge, index) => {
            return (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-4 tracking-tight">
                  {challenge.title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 tracking-tight">
                      {challenge.heading1}
                    </h4>
                    <div className="whitespace-pre-line space-y-2">
                      {challenge.description1}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 tracking-tight">
                      {challenge.heading2}
                    </h4>
                    <div className="whitespace-pre-line space-y-2">
                      {challenge.description2}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Solutions */}
      <div className="container my-24">
        <h2 className="text-2xl font-semibold mb-4 tracking-tight">
          {caseStudyData.solution.heading}
        </h2>
        <div className="max-w-3xl mb-8">
          {caseStudyData.solution.description}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Image
              className="rounded-xl drop-shadow"
              src="/assets/images/wielded-ui-light.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
            <h3 className="text-xl font-semibold mb-4 tracking-tight mt-6">
              {caseStudyData.solution.workspace.header}
            </h3>
            <div className="max-w-md">
              {caseStudyData.solution.workspace.description}
            </div>
          </div>
          <div className="col-span-1">
            <Image
              className="rounded-xl drop-shadow"
              src="/assets/images/persona-light.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
            <h3 className="text-xl font-semibold mb-4 tracking-tight mt-6">
              {caseStudyData.solution.persona.header}
            </h3>
            <div className="max-w-md">
              {caseStudyData.solution.persona.description}
            </div>
          </div>
          <div className="col-span-1">
            <Image
              className="rounded-xl drop-shadow"
              src="/assets/images/members-settings-light.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
            <h3 className="text-xl font-semibold mb-4 tracking-tight mt-6">
              {caseStudyData.solution.billing.header}
            </h3>
            <div className="max-w-md">
              {caseStudyData.solution.billing.description}
            </div>
          </div>
        </div>
      </div>
      {/* Persona */}
      <div className="container my-24">
        <h2 className="text-2xl font-semibold mb-4 tracking-tight">
          {caseStudyData.persona.heading}
        </h2>
        <div className="max-w-3xl mb-8">
          {caseStudyData.persona.description}
        </div>
        <div className="my-12">
          <PersonaGallery
            personas={caseStudyData.persona.personas.map((p) => ({
              id: p.title,
              name: p.title,
              description: p.description,
              content: "",
              created_at: "",
              updated_at: "",
            }))}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="container my-52 flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {caseStudyData.cta.heading}
          <br />
          {caseStudyData.cta.subheading}
        </h2>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          <Button>{caseStudyData.cta.cta}</Button>
        </div>
      </div>

      {/* FAQs */}
      <div className="container my-24">
        <h2 className="text-2xl font-semibold mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-8 grid-cols-2">
          <Accordion type="single" collapsible className="w-full">
            {caseStudyData.faqs
              .filter((_, i) => i % 2 == 0)
              .map((faq, index) => {
                return (
                  <AccordionItem value={index.toString()} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            {caseStudyData.faqs
              .filter((_, i) => i % 2 != 0)
              .map((faq, index) => {
                return (
                  <AccordionItem value={index.toString()} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </div>
      </div>
    </>
  );
};
