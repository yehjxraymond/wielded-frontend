"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { PersonaSuccess } from "@/context/PersonaContext";

export const PersonaInheritanceCombobox: React.FunctionComponent<{
  personas: PersonaSuccess["personas"];
  onAddInheritance: (personaId: string) => void;
}> = ({ personas, onAddInheritance }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full mt-4"
        >
          Select persona to inherit from...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search persona..." />
          <CommandEmpty>No persona found.</CommandEmpty>
          <CommandGroup>
            {personas.map((persona) => (
              <CommandItem
                key={persona.id}
                value={persona.name || ""}
                onSelect={() => {
                  onAddInheritance(persona.id);
                  setOpen(false);
                }}
              >
                {persona.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
