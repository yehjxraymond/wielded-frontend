import { Pricing } from "@/components/Home/HomeMarketing/Pricing";
import { CtaSeparator } from "@/components/MarketingUI/CtaSeparator";
import { Features } from "@/components/NewHome/Features";
import { Hero } from "@/components/NewHome/Hero";
import { PublicLayout } from "@/components/PublicLayout";

const LandingPage = () => {
  return (
    <PublicLayout>
      <Hero />
      <section className="mx-auto my-20 max-w-5xl">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Sound familiar?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg prose">
            <p className="mb-4">
              &quot;I spent hours tweaking AI-generated content, but it still
              doesn&apos;t sound like me.&quot;
            </p>
            <p className="text-sm text-gray-600">- Juanjo, Content Marketer</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg prose">
            <p className="mb-4">
              &quot;I have a dozen tabs open just to manage my AI tools and
              prompts!&quot;
            </p>
            <p className="text-sm text-gray-600">- Sergiu, Founder</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg prose">
            <p className="mb-4">
              &quot;My team is skeptical about AI. How do I get them on
              board?&quot;
            </p>
            <p className="text-sm text-gray-600">- Tiffany, HR Leader</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto mb-32">
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-center">
            Challenges with using AI at work
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl m-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">Inconsistent Results</h3>
            <p>
              AI-generated content that doesn&apos;t capture your unique voice,
              potentially damaging your brand.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Time Wasted</h3>
            <p>
              Hours spent tweaking AI outputs, switching between tools, and
              managing multiple subscriptions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Unnecessary Subscription
            </h3>
            <p>
              Paying for multiple AI services, often with overlapping features,
              as you chase the latest models.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Team Friction</h3>
            <p>
              Resistance from team members who see AI as complex and disruptive
              to their current workflow.
            </p>
          </div>
        </div>
      </section>
      <Features />
      <Pricing />
      <CtaSeparator />
    </PublicLayout>
  );
};

export default LandingPage;
