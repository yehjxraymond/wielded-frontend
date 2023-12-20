"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";

export const FaqSection: FunctionComponent<{
  title?: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  className?: string;
}> = ({ title, faqs, className }) => {
  return (
    <div className={cn("container my-24", className)}>
      <h2 className="text-2xl font-semibold mb-4 tracking-tight">
        {title || "Frequently Asked Questions"}
      </h2>
      <div className="grid gap-8 lg:grid-cols-2">
        <Accordion type="single" collapsible className="w-full">
          {faqs
            .filter((_, i) => i % 2 == 0)
            .map((faq, index) => {
              return (
                <AccordionItem value={index.toString()} key={index}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
        <Accordion type="single" collapsible className="w-full">
          {faqs
            .filter((_, i) => i % 2 != 0)
            .map((faq, index) => {
              return (
                <AccordionItem value={index.toString()} key={index}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </div>
    </div>
  );
};
