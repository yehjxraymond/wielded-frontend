import { usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import { FunctionComponent } from "react";

export const PersonaSelector: FunctionComponent = () => {
  const persona = usePersona();
  if (persona.state !== "success") return null;

  const { personas, selectPersona, selectedPersona } = persona;
  return (
    <div className="flex mt-8 gap-4 cursor-pointer overflow-y-auto">
      {personas.map((persona) => (
        <div
          className="pt-6 relative min-w-[200px] md:min-w-[250px] w-[200px] md:w-[250px] pb-4"
          key={persona.id}
          onClick={() => {
            if (persona.id === selectedPersona?.id) {
              selectPersona(undefined);
            } else {
              selectPersona(persona.id);
            }
          }}
        >
          <div className="h-10 w-10 bg-secondary-foreground text-secondary flex items-center justify-center rounded-full absolute top-0 left-4">
            <User2 className="h-7 w-7" />
          </div>
          <div
            className={cn(
              "bg-secondary text-secondary-foreground rounded-md px-4 py-6 h-40 overflow-hidden",
              persona.id === selectedPersona?.id &&
                "bg-accent text-accent-foreground"
            )}
          >
            <div className="text-lg font-medium mb-1">{persona.name}</div>
            <div className="text-sm">{persona.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
