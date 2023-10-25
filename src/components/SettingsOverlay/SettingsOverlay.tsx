import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";
import Link from "next/link";

const settingsSchema = z.object({
  workspaceName: z.string().min(3).max(50),
  openAiApiKey: z.string().length(51),
});

export const SettingsContent = () => {
  const [menuSelection, setMenuSelection] = useState("settings");

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      workspaceName: "",
      openAiApiKey: "",
    },
  });
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <DialogContent className="max-w-5xl flex p-0 h-[600px]">
      <div className="w-1/5 bg-secondary">
        <div>
          <div className="text-xs font-semibold mb-4 mt-4 mx-4">Workspace</div>
          <div
            className={cn(
              "text-sm font-semibold hover:bg-accent-foreground flex items-center px-4 py-1",
              menuSelection === "settings" && "bg-accent-foreground"
            )}
          >
            <Settings className="h-5 w-5 mr-1" />
            Settings
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        {menuSelection === "settings" && (
          <>
            <div className="text-xl font-semibold">Workspace Settings</div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4"
              >
                <FormField
                  control={form.control}
                  name="workspaceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormDescription>
                        This is the name of the workspace. Visible to all
                        members of the workspace.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="My Workspace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="openAiApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenAI API Key</FormLabel>
                      <FormDescription>
                        API Key obtained from{" "}
                        <Link
                          href="https://platform.openai.com/account/api-keys"
                          target="_blank"
                        >
                          https://platform.openai.com/account/api-keys
                        </Link>
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </DialogContent>
  );
};

export const SettingsOverlaySidebarTrigger = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center py-1">
          <Settings className="w-5 h-5 mr-2" /> Settings
        </div>
      </DialogTrigger>
      <SettingsContent />
    </Dialog>
  );
};
