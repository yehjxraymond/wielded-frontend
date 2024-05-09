import Link from "next/link";

export const FooterPublic = () => {
  return (
    <footer className="bg-muted text-muted-foreground py-12 mt-10">
      <div className="container grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="text-lg text-primary font-semibold tracking-tight">
          wielded
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold">Company</div>
          <Link href="/blog" className="block">
            Blog
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <div className="block font-semibold">Features</div>
          <Link href="/chatgpt-for-teams" className="block">
            ChatGPT for Teams
          </Link>
          <Link href="/chatgpt-ui-for-azure-openai" className="block">
            Chat Interface for Azure OpenAI
          </Link>
          <Link href="/multi-model-ai-lab-for-education" className="block">
            Multi-model AI Lab for Education
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold">More</div>
          <Link href="/chatgpt-prompt" className="block">
            ChatGPT Prompt Repository
          </Link>
          <Link href="/privacy" className="block">
            Privacy policy
          </Link>
          <Link href="/terms" className="block">
            Terms and conditions
          </Link>
          <Link href="/contact?source=footer" className="block">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
