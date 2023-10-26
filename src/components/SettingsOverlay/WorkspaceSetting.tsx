import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
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
import {
  Workspace,
  WorkspaceSuccess,
  useWorkspace,
} from "@/context/WorkspaceContext";
import { Skeleton } from "../ui/skeleton";
import { FunctionComponent } from "react";
import { MutationStatus } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const settingsSchema = z.object({
  workspaceName: z.string().min(3).max(50),
  openAiApiKey: z.string().length(51),
});

export const WorkspaceSettingForm: FunctionComponent<{
  workspace: Workspace;
  updateWorkspace: WorkspaceSuccess["updateWorkspace"];
  updateWorkspaceStatus: MutationStatus;
}> = ({ workspace, updateWorkspace, updateWorkspaceStatus }) => {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      workspaceName: workspace.name || "My Workspace",
      openAiApiKey: workspace.openAiApiKey,
    },
  });
  const isPending = updateWorkspaceStatus === "pending";
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    if (!isPending)
      updateWorkspace({
        workspaceId: workspace.id,
        workspace: {
          name: values.workspaceName,
          openAiApiKey: values.openAiApiKey,
        },
      });
  }

  return (
    <>
      <div className="text-xl font-semibold">Workspace Settings</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          {updateWorkspaceStatus === "success" && (
            <Alert>
              <AlertTitle>Updated</AlertTitle>
              <AlertDescription>
                Workspace settings have been updated!
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace Name</FormLabel>
                <FormDescription>
                  This is the name of the workspace. Visible to all members of
                  the workspace.
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
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

const NoPermission = () => {
  return (
    <div>
      <div className="text-xl font-semibold">Workspace Settings</div>
      <div className="mt-4 text-sm font-semibold text-accent-foreground">
        You do not have permission to edit this workspace.
      </div>
    </div>
  );
};

export const WorkspaceSetting = () => {
  const workspace = useWorkspace();
  if (workspace.state === "success") {
    const currentWorkspace = workspace.workspaces.find(
      (w) => w.id === workspace.currentWorkspace
    );
    if (!currentWorkspace) return <NoPermission />;
    if (currentWorkspace.role === "user") return <NoPermission />;
    return (
      <WorkspaceSettingForm
        workspace={currentWorkspace}
        updateWorkspace={workspace.updateWorkspace}
        updateWorkspaceStatus={workspace.updateWorkspaceStatus}
      />
    );
  }
  return (
    <div>
      <div className="text-xl font-semibold">Workspace Settings</div>
      <Skeleton className="mt-4 h-5 w-[250px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
    </div>
  );
};
