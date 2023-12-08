import { Persona, usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { Input } from "../ui/input";

export const PersonaGallery: FunctionComponent<{
  personas: Persona[];
  selectedPersona?: Persona;
  onClick?: (id: string) => void;
}> = ({ personas, selectedPersona, onClick }) => {
  const [query, setQuery] = useState("");
  const filteredPersonas = personas.filter(
    (persona) =>
      query === "" ||
      (persona.name &&
        persona.name.toLowerCase().includes(query.toLowerCase())) ||
      (persona.description &&
        persona.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="mt-4">
      <Input
        className="max-w-lg"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <div
        className={cn(
          "flex mt-8 gap-4 overflow-y-auto",
          onClick && "cursor-pointer"
        )}
      >
        {filteredPersonas.map((persona) => (
          <div
            className="pt-6 relative min-w-[200px] md:min-w-[250px] w-[200px] md:w-[250px] pb-4"
            key={persona.id}
            onClick={() => onClick && onClick(persona.id)}
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
    </div>
  );
};

export const PersonaSelector: FunctionComponent = () => {
  const persona = usePersona();
  if (persona.state !== "success") return null;

  const { personas, selectPersona, selectedPersona } = persona;
  const handleSelectPersona = (id: string) => {
    if (id === selectedPersona?.id) {
      selectPersona(undefined);
    } else {
      selectPersona(id);
    }
  };
  return (
    <>
      {personas.length > 0 && <div className="font-semibold">Persona</div>}
      <PersonaGallery
        personas={personas}
        onClick={handleSelectPersona}
        selectedPersona={selectedPersona}
      />
    </>
  );
};
