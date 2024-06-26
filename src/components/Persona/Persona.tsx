import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  PersonaSuccess,
  QuickAction,
  ShortcutType,
  getInheritedInstructions,
  usePersona,
} from "@/context/PersonaContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ChevronDown, ChevronUp, User2 } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SidebarLayout } from "../Layout";
import { LearnMoreOverlay } from "../LearnMoreOverlay";
import { FullPageLoader } from "../Loader";
import { useFileUpload } from "../MesageBar/useFileUpload";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { PersonaInheritanceCombobox } from "./PersonaInheritanceCombobox";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormType = { type: "create" } | { type: "edit"; id: string };

const personaSchema = z.object({
  name: z.string(),
  description: z.string(),
  content: z.string(),
  inheritedPersonaIds: z.array(z.string()).optional(),
});

const PersonaForm: FunctionComponent<{
  formType: FormType;
  personas: PersonaSuccess["personas"];
  createPersona: PersonaSuccess["createPersona"];
  updatePersona: PersonaSuccess["updatePersona"];
  deletePersona: PersonaSuccess["deletePersona"];
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}> = ({
  formType,
  personas,
  setIsOpen,
  createPersona,
  updatePersona,
  deletePersona,
  isOpen,
}) => {
  const [isInheritanceOpen, setIsInheritanceOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState<QuickAction[]>([]);
  const [activeShortcutContent, setActiveShortcutContent] =
    useState<string>("");
  const defaultValues =
    formType.type === "edit"
      ? personas.find((p) => p.id === formType.id)
      : undefined;
  const [inheritedPersonaIds, setInheritedPersonaIds] = useState<string[]>([]);
  const { setUploadedFiles, uploadedFiles, removeFile, handleUploadFiles } =
    useFileUpload(true, []);
  const form = useForm<z.infer<typeof personaSchema>>({
    resolver: zodResolver(personaSchema),
  });
  // Inside your Persona component
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleUploadFiles,
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt", ".md", ".mdx", ".js", ".ts", ".tsx"],
    },
  });

  useEffect(() => {
    if (isOpen) {
      setInheritedPersonaIds(defaultValues?.inheritedPersonaIds || []);
      setUploadedFiles(defaultValues?.files || []);
    }
  }, [isOpen, defaultValues, setUploadedFiles]);
  useEffect(() => {
    if (defaultValues) {
      form.setValue("name", defaultValues.name || "");
      form.setValue("description", defaultValues.description || "");
      form.setValue("content", defaultValues.content);
      setShortcuts(defaultValues.shortcuts || []);
    } else {
      form.setValue("name", "");
      form.setValue("description", "");
      form.setValue("content", "");
      setShortcuts([]);
    }
  }, [defaultValues, form]);

  const onAddShortcut = (shortcut: QuickAction) => {
    setShortcuts(
      [...shortcuts, shortcut].sort((b, a) => a.type.localeCompare(b.type))
    );
  };
  const onRemoveShortcut = (index: number) => {
    setShortcuts(shortcuts.filter((_, i) => i !== index));
  };
  const onAddQuickAction = (
    e: React.FormEvent<HTMLButtonElement>,
    type: ShortcutType
  ) => {
    e.preventDefault();
    onAddShortcut({
      content: activeShortcutContent,
      type,
    });
    setActiveShortcutContent("");
  };

  function onSubmit(values: z.infer<typeof personaSchema>) {
    if (formType.type === "create") {
      createPersona({
        ...values,
        inheritedPersonaIds,
        files: uploadedFiles,
        shortcuts: shortcuts.length > 0 ? shortcuts : undefined,
      });
    } else {
      updatePersona({
        ...values,
        id: formType.id,
        inheritedPersonaIds,
        files: uploadedFiles,
        shortcuts,
      });
    }
  }
  const onDelete = (id: string) => {
    window.confirm("Are you sure you want to delete this persona?") &&
      deletePersona(id);
  };
  const handleRemovePersonaInheritance = (id: string) => {
    setInheritedPersonaIds(inheritedPersonaIds.filter((i) => i !== id));
  };

  let fullInstructions = "";
  try {
    const inheritedInstructions = getInheritedInstructions(
      inheritedPersonaIds,
      personas
    );
    if (inheritedInstructions) {
      fullInstructions = [
        getInheritedInstructions(inheritedPersonaIds, personas),
        form.getValues("content"),
      ].join("\n\n");
    } else {
      fullInstructions = form.getValues("content");
    }
  } catch (e) {
    fullInstructions =
      "ERROR - PERSONA MIGHT HAVE SELF REFERENCING INHERITANCE";
  }

  return (
    <DialogContent
      onPointerDownOutside={() => setIsOpen(false)}
      className="max-h-full overflow-scroll"
    >
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
              <Collapsible onOpenChange={setIsInheritanceOpen}>
                <CollapsibleTrigger className="flex justify-between w-full items-center mb-2">
                  <FormLabel>Files ({uploadedFiles.length})</FormLabel>
                  <div>
                    {isInheritanceOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-muted p-4 rounded">
                  <div className="space-y-2">
                    {uploadedFiles.map((file, i) => {
                      return (
                        <div
                          className="flex font-medium justify-between gap-2"
                          key={i}
                        >
                          <div>{file.name}</div>
                          <div
                            className="cursor-pointer"
                            onClick={() => removeFile(i)}
                          >
                            Remove
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div {...getRootProps()} className="cursor-pointer">
                    <input {...getInputProps()} className="hidden" />
                    <div
                      className="w-full h-20 flex items-center justify-center border-2 mt-2 rounded"
                      onClick={() => open()}
                    >
                      {isDragActive ? (
                        <>Drop file(s)</>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Drop file(s) to upload
                        </>
                      )}
                    </div>
                    {/* <Upload className="h-6 w-6" onClick={() => open()} /> */}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible onOpenChange={setIsInheritanceOpen}>
                <CollapsibleTrigger className="flex justify-between w-full items-center mb-2">
                  <FormLabel>Quick Actions ({shortcuts.length})</FormLabel>
                  <div>
                    {isInheritanceOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-muted p-4 rounded">
                  {shortcuts.map((shortcut, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center mb-2  "
                    >
                      <div>
                        ({shortcut.type}) {shortcut.content}
                      </div>
                      <div
                        className="cursor-pointer ml-2"
                        onClick={() => onRemoveShortcut(i)}
                      >
                        Remove
                      </div>
                    </div>
                  ))}
                  <div className="my-4">
                    <div className="mb-2">Add new quick action:</div>
                    <div>
                      <Input
                        placeholder="Prompt"
                        value={activeShortcutContent}
                        onChange={(e) =>
                          setActiveShortcutContent(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                      <Button
                        onClick={(e) =>
                          onAddQuickAction(e, ShortcutType.FOLLOW_UP)
                        }
                        size="sm"
                      >
                        Add Follow-up Action
                      </Button>
                      <Button
                        onClick={(e) =>
                          onAddQuickAction(e, ShortcutType.INITIAL)
                        }
                        size="sm"
                      >
                        Add Initial Action
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible onOpenChange={setIsInheritanceOpen}>
                <CollapsibleTrigger className="flex justify-between w-full items-center mb-2">
                  <FormLabel>
                    Inherited Persona ({inheritedPersonaIds.length})
                  </FormLabel>
                  <div>
                    {isInheritanceOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-muted p-4 rounded">
                  <div className="space-y-4">
                    {inheritedPersonaIds?.map((id) => (
                      <div
                        key={id}
                        className="flex font-medium justify-between"
                      >
                        <div>
                          {personas.find((p) => p.id === id)?.name || (
                            <span className="text-destructive">
                              <AlertTriangle className="w-4 h-4 inline-block" />{" "}
                              MISSING PERSONA
                            </span>
                          )}
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleRemovePersonaInheritance(id)}
                        >
                          Remove
                        </div>
                      </div>
                    ))}
                  </div>
                  <PersonaInheritanceCombobox
                    personas={personas.filter(
                      (p) => p.id !== defaultValues?.id
                    )}
                    onAddInheritance={(id) => {
                      const existingIds = inheritedPersonaIds;
                      if (existingIds) {
                        setInheritedPersonaIds([...existingIds, id]);
                      } else {
                        setInheritedPersonaIds([id]);
                      }
                    }}
                  />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible onOpenChange={setIsInheritanceOpen}>
                <CollapsibleTrigger className="flex justify-between w-full items-center mb-2">
                  <FormLabel>Preview Full Instructions</FormLabel>
                  <div>
                    {isInheritanceOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-muted p-4 rounded max-h-40 max-w-full overflow-scroll w-full whitespace-pre-wrap">
                  {fullInstructions}
                </CollapsibleContent>
              </Collapsible>

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
    <SidebarLayout>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <PersonaForm
          isOpen={isOpen}
          formType={formType}
          personas={personas}
          setIsOpen={setIsOpen}
          createPersona={createPersona}
          updatePersona={updatePersona}
          deletePersona={deletePersona}
        />
        <div className="lg:flex px-4 justify-between items-end mt-12">
          <div className="max-w-xl">
            <h1 className="text-2xl">Persona</h1>
            <p className="text-sm text-secondary-foreground">
              Personas allow you to get highly customised output from the AI and
              switch gears between different tasks quickly
            </p>
            <LearnMoreOverlay
              title="Learn more about Persona"
              videoUrl="https://www.youtube-nocookie.com/embed/gae3e4l-TLs?si=TVfAW-1rFmKzbDlW"
            />
          </div>
          <div className="mt-6 lg:mt-0">
            <Button
              onClick={() => {
                setIsOpen(true);
                setFormType({ type: "create" });
              }}
            >
              Create a persona
            </Button>
          </div>
        </div>

        <div className="px-4 mt-8">
          <Input
            className="max-w-lg"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
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
            {filteredPersonas.map((persona) => (
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
  return <FullPageLoader />;
};
