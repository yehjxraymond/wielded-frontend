import {
  Workspace,
  WorkspaceSuccess,
  useWorkspace,
} from "@/context/WorkspaceContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { MutationStatus } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";
import { NoPermission } from "../NoPermission";

const settingsSchema = z.object({
  workspaceName: z.string().min(3).max(50),
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
    },
  });
  const isPending = updateWorkspaceStatus === "pending";
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    if (!isPending) {
      updateWorkspace({
        workspaceId: workspace.id,
        workspace: {
          name: values.workspaceName,
        },
      });
    }
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
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export const WorkspaceSetting = () => {
  const workspace = useWorkspace();
  if (workspace.state === "success") {
    const currentWorkspace = workspace.workspaces.find(
      (w) => w.id === workspace.currentWorkspace
    );
    if (!currentWorkspace)
      return (
        <NoPermission title="No Workspace" description="Workspace not found" />
      );
    if (currentWorkspace.role === "user")
      return (
        <NoPermission
          title="Members Settings"
          description="You do not have permission to edit this workspace."
        />
      );
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
