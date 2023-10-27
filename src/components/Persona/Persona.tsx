import { User2 } from "lucide-react";
import { SidebarLayout } from "../Layout";
import { Button } from "../ui/button";

export const Persona = () => {
  const personas = [
    {
      name: "Frontend Engineer",
      description:
        "I’m a marketing manager overseeing our company’s LinkedIn strategy. Out primary goal is to increase B2B engagement and drive traffic to our website. Our recent focus",
    },
    {
      name: "Frontend Engineer",
      description:
        "I’m a marketing manager overseeing our company’s LinkedIn strategy. Out primary goal is to increase B2B engagement and drive traffic to our website. Our recent focus",
    },
    {
      name: "Frontend Engineer",
      description:
        "I’m a marketing manager overseeing our company’s LinkedIn strategy. Out primary goal is to increase B2B engagement and drive traffic to our website. Our recent focus",
    },
    {
      name: "Frontend Engineer",
      description:
        "I’m a marketing manager overseeing our company’s LinkedIn strategy. Out primary goal is to increase B2B engagement and drive traffic to our website. Our recent focus",
    },
  ];
  return (
    <SidebarLayout>
      <div className="flex px-4 justify-between items-end">
        <div className="max-w-xl">
          <h1 className="text-2xl mb-2">Persona</h1>
          <p className="text-sm text-secondary-foreground">
            Personas are custom instructions that are passed as context at the
            start of your chats. They allow you to get highly customised output
            from the AI and switch gears between different tasks quickly
          </p>
        </div>
        <div>
          <Button>Create a persona</Button>
        </div>
      </div>

      {personas.length === 0 && (
        <div className="text-center mt-40">
          <div className="text-xl font-semibold">
            You do not have any personas
          </div>
          <div>Create one to customize your chat experience</div>
        </div>
      )}

      {personas.length > 0 && (
        <div className="grid grid-cols-4 px-4 mt-16 gap-4">
          {personas.map((persona) => (
            <div className="pt-6 relative">
              <div className="h-10 w-10 bg-secondary-foreground text-secondary flex items-center justify-center rounded-full absolute top-0 left-4">
                <User2 className="h-7 w-7" />
              </div>
              <div className="bg-secondary text-secondary-foreground rounded-md px-4 py-6">
                <div className="text-xl font-semibold mb-2">{persona.name}</div>
                <div className="text-sm">{persona.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SidebarLayout>
  );
};
