import { useTheme } from "next-themes";
import Image from "next/image";

export const MainFeatures = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <>
      {/* Unified Team Workspace */}
      <div className="container lg:flex mb-52 items-center">
        <div className="max-w-2xl lg:mr-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Unified Team Workspace
          </h2>
          <div className="leading-6 my-8">
            Our platform transcends the conventional chat collaboration
            boundaries, offering a unique space that blends conversations,
            prompts, personas, and project management seamlessly.
          </div>
          <div className="text-xl font-semibold tracking-tight mb-2">
            Team-Driven Spaces
          </div>
          <div className="leading-6">
            Share chats, personas, and prompts with colleagues, fostering a
            rich, collaborative culture that thrives on shared knowledge and
            tools.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Personal Workspaces
          </div>
          <div className="leading-6">
            Carve out your individual workspace within the team environment to
            focus and manage tasks without distractions, maintaining personal
            productivity.
          </div>
        </div>
        <div className="my-6 lg:my-0">
          {isDark ? (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/wielded-ui-dark.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
          ) : (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/wielded-ui-light.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
          )}
        </div>
      </div>
      {/* Enhanced ChatGPT Interface */}
      <div className="container lg:flex mb-52 items-center">
        <div className="max-w-2xl lg:order-2 lg:ml-10">
          <div className="text-3xl font-semibold tracking-tight">
            Enhanced ChatGPT Interface
          </div>
          <div className="leading-6 my-8">
            Navigate through an improved ChatGPT user interface customized for
            teams, offering organisation and intuition like never before.
          </div>
          <div className="text-xl font-semibold tracking-tight mb-2">
            Intuitive Chat Interactions
          </div>
          <div className="leading-6">
            Our ChatGPT UI boasts intuitive controls, elegantly organizing
            information to declutter your team&apos;s digital workspace.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Persona for multi-tasking
          </div>
          <div className="leading-6">
            Implement multiple personas which sets custom instructions for each
            chat to craft unique GPTs for various tasks to enhance your
            team&apos;s focus and efficiency.
          </div>
        </div>
        <div className="my-6 lg:my-0 lg:order-1">
          {isDark ? (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/persona-dark.png"
              width={900}
              height={800}
              alt="ChatGPT Custom GPTs UI"
            />
          ) : (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/persona-light.png"
              width={900}
              height={800}
              alt="ChatGPT Custom GPTs UI"
            />
          )}
        </div>
      </div>
      {/* Streamlined Team Billing */}
      <div className="container lg:flex mb-52 items-center">
        <div className="max-w-2xl lg:mr-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Streamlined Team Management & Billing
          </h2>
          <div className="leading-6 my-8">
            Ditch multiple subscriptions with a single team chatgpt billing
            account, making management easy and cost-effective.
          </div>
          <div className="text-xl font-semibold tracking-tight mb-2">
            Effortless Member Management
          </div>
          <div className="leading-6">
            Conveniently add or remove team members, leveraging a single
            subscription for seamless user administration.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Consolidated Billing System
          </div>
          <div className="leading-6">
            Simplify finances with a single, unified team billing account,
            streamlining the payment process for the entire team subscription to
            ChatGPT.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Direct API Savings
          </div>
          <div className="leading-6">
            Unlock cost savings with OpenAI&apos;s API direct integration. Enjoy
            the cost-effective nature of paying solely for your actual usage,
            optimizing your expenses.
          </div>
        </div>
        <div className="my-6 lg:my-0">
          {isDark ? (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/members-settings-dark.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
          ) : (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/members-settings-light.png"
              width={900}
              height={800}
              alt="ChatGPT Unified Team Workspace UI"
            />
          )}
        </div>
      </div>
      {/* Limitless Image Generation with Dall-E 3 */}
      <div className="container lg:flex mb-52 items-center">
        <div className="max-w-2xl lg:order-2 lg:ml-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Limitless Image Generation with Dall-E 3
          </h2>
          <div className="leading-6 my-8">
            Unleash creativity across your team without worrying about rate
            limits. Turn every team member into a digital artist with Wielded.
          </div>
          <div className="text-xl font-semibold tracking-tight mb-2">
            Creativity without boundaries
          </div>
          <div className="leading-6">
            Dall-E 3 Access for the Entire Team. Forget the hassle of individual
            subscriptions—every team member can harness the capability of Dall-E
            3 without constraints. Generate high-quality images as a team,
            elevating your project visuals without limitations.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Unlimited Image Generation
          </div>
          <div className="leading-6">
            Create more, wait less. With Wielded, your team can generate up to
            50 images per minute, bypassing the individual rate limits typically
            encountered. Refer to the OpenAI rate limits for more details.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Granular Style Controls
          </div>
          <div className="leading-6">
            Control your creative output with simple and detailed
            prompts—achieve the exact style your project requires. Start with a
            simple prompt and let Wielded refine it into a detailed one,
            offering you options for creative exploration or consistent imagery.
          </div>
          <div className="text-xl font-semibold tracking-tight mt-6 mb-2">
            Your Creations at a Glance
          </div>
          <div className="leading-6">
            Seamlessly browse through all generated images in our intuitive
            gallery view. Looking for something specific? Use the text search
            feature to quickly find your past creations.
          </div>
        </div>
        <div className="my-6 lg:my-0 lg:order-1">
          {isDark ? (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/dalle-3-gallery-dark.png"
              width={900}
              height={800}
              alt="Dall-E 3 Image Generation UI"
            />
          ) : (
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/assets/images/dalle-3-gallery-light.png"
              width={900}
              height={800}
              alt="Dall-E 3 Image Generation UI"
            />
          )}
        </div>
      </div>
    </>
  );
};
