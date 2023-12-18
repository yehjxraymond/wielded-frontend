import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
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
import {
  Workspace,
  WorkspaceSuccess,
  useWorkspace,
} from "@/context/WorkspaceContext";
import { Skeleton } from "../../ui/skeleton";
import { FunctionComponent } from "react";
import { MutationStatus } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { NoPermission } from "../NoPermission";
import { LearnMoreOverlay } from "@/components/LearnMoreOverlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const settingsSchema = z.object({
  workspaceName: z.string().min(3).max(50),
  apiKey: z.string(),
  apiEndpoint: z.string().optional(),
  backendType: z.enum(["open_ai", "azure"]),
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
      apiKey: workspace.apiKey,
      backendType: workspace.backendType || "open_ai",
      apiEndpoint: workspace.apiEndpoint || undefined,
    },
  });
  const isPending = updateWorkspaceStatus === "pending";
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    if (!isPending) {
      if (values.backendType === "open_ai") {
        updateWorkspace({
          workspaceId: workspace.id,
          workspace: {
            name: values.workspaceName,
            apiKey: values.apiKey,
            apiEndpoint: null,
            backendType: values.backendType,
          },
        });
      } else {
        updateWorkspace({
          workspaceId: workspace.id,
          workspace: {
            name: values.workspaceName,
            apiKey: values.apiKey,
            apiEndpoint: values.apiEndpoint,
            backendType: values.backendType,
          },
        });
      }
    }
  }

  return (
    <>
      <div className="text-xl font-semibold">Workspace Settings</div>
      <LearnMoreOverlay
        title="Set Up with OpenAI API"
        videoUrl="https://www.youtube-nocookie.com/embed/gOPk8Ep2mTs?si=iTwsZQAkHfRVyEUg"
      />
      <LearnMoreOverlay
        title="Set Up with Azure"
        videoUrl="https://www.youtube-nocookie.com/embed/Sl4yKQUPpKc?si=x3rWrD3eqc5YibPK"
      />
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
            name="backendType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backend</FormLabel>
                <FormDescription>
                  Which AI service are you using. OpenAI is the default.
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a backend" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open_ai">OpenAI</SelectItem>
                    <SelectItem value="azure">
                      Azure (Enterprise Only)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("backendType") === "azure" && (
            <FormField
              control={form.control}
              name="apiEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Azure Endpoint</FormLabel>
                  <FormDescription>
                    Endpoint URL obtained from &apos;Keys and Endpoint&apos; tab
                    of your Azure Portal. Make sure that a model has been
                    deployed.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://<REGION>.openai.azure.com/openai/deployments/<MODEL_NAME>/"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                {form.watch("backendType") === "open_ai" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <FormLabel>Azure API Key</FormLabel>
                    <FormDescription>
                      API Key obtained from &apos;Keys and Endpoint&apos; tab of
                      your Azure Portal. Make sure that a model has been
                      deployed.
                    </FormDescription>
                  </>
                )}

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
