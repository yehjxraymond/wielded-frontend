export const PainFeature = () => {
  return (
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
  );
};
