import { PersonaSuccess, usePersona } from "@/context/PersonaContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2 } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SidebarLayout } from "../Layout";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type FormType = { type: "create" } | { type: "edit"; id: string };

const personaSchema = z.object({
  name: z.string(),
  description: z.string(),
  content: z.string(),
});

const PersonaForm: FunctionComponent<{
  formType: FormType;
  personas: PersonaSuccess["personas"];
  createPersona: PersonaSuccess["createPersona"];
  updatePersona: PersonaSuccess["updatePersona"];
  deletePersona: PersonaSuccess["deletePersona"];
  setIsOpen: (isOpen: boolean) => void;
}> = ({
  formType,
  personas,
  setIsOpen,
  createPersona,
  updatePersona,
  deletePersona,
}) => {
  const defaultValues =
    formType.type === "edit"
      ? personas.find((p) => p.id === formType.id)
      : undefined;
  const form = useForm<z.infer<typeof personaSchema>>({
    resolver: zodResolver(personaSchema),
  });
  useEffect(() => {
    if (defaultValues) {
      form.setValue("name", defaultValues.name || "");
      form.setValue("description", defaultValues.description || "");
      form.setValue("content", defaultValues.content);
    } else {
      form.setValue("name", "");
      form.setValue("description", "");
      form.setValue("content", "");
    }
  }, [defaultValues, form]);
  function onSubmit(values: z.infer<typeof personaSchema>) {
    if (formType.type === "create") {
      createPersona(values);
    } else {
      updatePersona({ ...values, id: formType.id });
    }
  }
  const onDelete = (id: string) => {
    window.confirm("Are you sure you want to delete this persona?") &&
      deletePersona(id);
  };
  return (
    <DialogContent onPointerDownOutside={() => setIsOpen(false)}>
      <DialogHeader>
        <DialogTitle>
          {formType.type === "create" ? "Create a new persona" : "Edit persona"}
        </DialogTitle>
        <DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-4 text-primary"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          formType.type === "create"
                            ? "Content Writer - LinkedIn"
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormDescription>
                      For displays only. Will be automatically populated if left
                      blank.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder={
                          formType.type === "create"
                            ? "LinkedIn content writer, adept at crafting compelling stories that resonate with professionals, driving brand awareness and thought leadership in the AI space."
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persona</FormLabel>
                    <FormDescription>
                      Custom instructions for this persona
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        rows={8}
                        placeholder={
                          formType.type === "create"
                            ? "I'm a LinkedIn content writer focusing on conversational AI for mid-to-senior professionals, I need posts in an informal, engaging style with short sentences for rhythm and easy readability, targeting a Gunning Fog Index of 12."
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                {formType.type === "edit" && (
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(formType.id)}
                  >
                    Delete
                  </Button>
                )}

                <Button type="submit">
                  {formType.type == "create" ? "Create" : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export const PersonaInternal: FunctionComponent<PersonaSuccess> = ({
  personas,
  createPersona,
  updatePersona,
  deletePersona,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<FormType>({ type: "create" });

  return (
    <SidebarLayout>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <PersonaForm
          formType={formType}
          personas={personas}
          setIsOpen={setIsOpen}
          createPersona={createPersona}
          updatePersona={updatePersona}
          deletePersona={deletePersona}
        />
        <div className="lg:flex px-4 justify-between items-end mt-12">
          <div className="max-w-xl">
            <h1 className="text-2xl mb-2">Persona</h1>
            <p className="text-sm text-secondary-foreground">
              Personas are custom instructions that are passed as context at the
              start of your chats. They allow you to get highly customised
              output from the AI and switch gears between different tasks
              quickly
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <DialogTrigger>
              <Button
                onClick={() => {
                  setIsOpen(true);
                  setFormType({ type: "create" });
                }}
              >
                Create a persona
              </Button>
            </DialogTrigger>
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
          <div className="grid grid-cols-2 md:grid-cols-4 px-4 mt-16 gap-4 cursor-pointer">
            {personas.map((persona) => (
              <div
                className="pt-6 relative"
                key={persona.id}
                onClick={() => {
                  setFormType({ type: "edit", id: persona.id });
                  setIsOpen(true);
                }}
              >
                <div className="h-10 w-10 bg-secondary-foreground text-secondary flex items-center justify-center rounded-full absolute top-0 left-4">
                  <User2 className="h-7 w-7" />
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-md px-4 py-6 h-40 overflow-hidden">
                  <div className="text-lg font-medium mb-1">{persona.name}</div>
                  <div className="text-sm">{persona.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </SidebarLayout>
  );
};

export const Persona = () => {
  const personaState = usePersona();
  if (personaState.state === "success") {
    return <PersonaInternal {...personaState} />;
  }
  // TODO loading
  return <div>Loading...</div>;
};
