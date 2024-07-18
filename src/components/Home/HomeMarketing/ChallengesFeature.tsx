export const ChallengesFeature = () => {
  return (
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
            Paying for multiple AI services, often with overlapping features, as
            you chase the latest models.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Team Friction</h3>
          <p>
            Resistance from team members who see AI as complex and disruptive to
            their current workflow.
          </p>
        </div>
      </div>
    </section>
  );
};
