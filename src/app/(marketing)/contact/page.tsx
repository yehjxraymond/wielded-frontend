import { PublicLayout } from "@/components/PublicLayout";
import { Metadata } from "next";
import { ContactForm } from "./ContactForm";

const Content = () => {
  return (
    <PublicLayout>
      <ContactForm />
    </PublicLayout>
  );
};

export default Content;

export const metadata: Metadata = {
  title: "Contact Us - Wielded",
  description:
    "Unsure if Wielded will serve your needs? Fill out the contact form and we'll set up a call to discuss your needs.",
};
