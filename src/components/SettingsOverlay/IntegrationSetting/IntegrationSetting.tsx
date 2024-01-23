import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Workspace, useWorkspace } from "@/context/WorkspaceContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { NoPermission } from "../NoPermission";
import {
  AzureOpenAiForm,
  OpenAiForm,
  AwsBedrockForm,
  ClaudeForm,
} from "./forms";
import {
  humanReadableModel,
  humanReadableProvider,
} from "./humanReadableNames";
import {
  CreateIntegrationDto,
  IntegrationDto,
  UpdateIntegrationDto,
  integrationProviders,
  useIntegrations,
} from "./useIntegrations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const IntegrationEditForm: FunctionComponent<{
  integration: IntegrationDto;
  handleEdit: (values: UpdateIntegrationDto, integrationId?: string) => void;
  handleDelete?: (integrationId: string) => void;
  isPending: boolean;
}> = ({ integration, handleEdit, handleDelete, isPending }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div>
      <div
        className="flex justify-between mt-2 mr-2 cursor-pointer"
        onClick={() => setIsEditOpen(!isEditOpen)}
      >
        <div>{humanReadableModel(integration.model)}</div>
        <div>
          {isEditOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </div>
      </div>
      {isEditOpen && (
        <div className="mt-2 p-4 bg-muted">
          {integration.provider === "open_ai" && (
            <OpenAiForm
              integration={integration}
              handleSubmit={handleEdit}
              handleDelete={handleDelete}
              isPending={isPending}
            />
          )}
          {integration.provider === "azure_open_ai" && (
            <AzureOpenAiForm
              integration={integration}
              handleSubmit={handleEdit}
              handleDelete={handleDelete}
              isPending={isPending}
            />
          )}
          {integration.provider === "aws_bedrock" && (
            <AwsBedrockForm
              integration={integration}
              handleSubmit={handleEdit}
              handleDelete={handleDelete}
              isPending={isPending}
            />
          )}
          {integration.provider === "claude" && (
            <ClaudeForm
              integration={integration}
              handleSubmit={handleEdit}
              handleDelete={handleDelete}
              isPending={isPending}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const CreateIntegrationForm: FunctionComponent<{
  isPending: boolean;
  workspaceId: string;
  handleCreate: (values: CreateIntegrationDto) => void;
}> = ({ isPending, handleCreate, workspaceId }) => {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] =
    useState<IntegrationDto["provider"]>("open_ai");

  const handleCreateIntegration = async (values: UpdateIntegrationDto) => {
    if (!values.model) throw new Error("Model is required");
    if (!values.config) throw new Error("Config is required");
    const { model, config } = values;
    await handleCreate({ config, model, provider, type: "chat", workspaceId });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex w-full justify-end mt-4">
        <Button>New Integration</Button>
      </DialogTrigger>
      <DialogContent className="overflow-scroll max-h-screen">
        <div>
          <div className="text-lg font-medium">Create Integration</div>
          <div className="mt-4">
            <div className="font-medium">Provider</div>
            <div className="mt-2">
              <Select
                value={provider}
                onValueChange={(e) =>
                  setProvider(e as IntegrationDto["provider"])
                }
              >
                <SelectTrigger>
                  <SelectValue>{humanReadableProvider(provider)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {integrationProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {humanReadableProvider(provider)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-4 bg-muted mt-4">
            {provider === "open_ai" && (
              <OpenAiForm
                isPending={isPending}
                handleSubmit={handleCreateIntegration}
                submitText="Add OpenAI Integration"
              />
            )}
            {provider === "azure_open_ai" && (
              <AzureOpenAiForm
                isPending={isPending}
                handleSubmit={handleCreateIntegration}
                submitText="Add Azure Integration"
              />
            )}
            {provider === "aws_bedrock" && (
              <AwsBedrockForm
                isPending={isPending}
                handleSubmit={handleCreateIntegration}
                submitText="Add AWS Integration"
              />
            )}
            {provider === "claude" && (
              <ClaudeForm
                isPending={isPending}
                handleSubmit={handleCreateIntegration}
                submitText="Add Claude Integration"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const IntegrationSettingForm: FunctionComponent<{
  workspace: Workspace;
}> = ({ workspace }) => {
  const {
    integrations,
    updateIntegrationMutation,
    deleteIntegrationMutation,
    createIntegrationMutation,
  } = useIntegrations(workspace.id);
  const { toast } = useToast();
  const groupedIntegrations = integrations?.reduce<
    Record<string, IntegrationDto[]>
  >((acc, integration) => {
    if (!acc[integration.provider]) {
      acc[integration.provider] = [];
    }
    acc[integration.provider].push(integration);
    return acc;
  }, {});

  const handleEdit = async (
    values: UpdateIntegrationDto,
    integrationId?: string
  ) => {
    if (!integrationId) return;
    try {
      updateIntegrationMutation.mutateAsync({
        workspaceId: workspace.id,
        integrationId,
        integration: values,
      });
      toast({
        title: "Integration Updated",
        description: `Integration for ${values.model} updated successfully`,
      });
    } catch (e) {
      if (e instanceof Error)
        toast({
          title: `Error updating integration ${integrationId}`,
          description: `${e.message}`,
        });
    }
  };

  const handleDelete = async (integrationId: string) => {
    try {
      await deleteIntegrationMutation.mutateAsync({
        workspaceId: workspace.id,
        integrationId,
      });
      toast({
        title: "Integration Deleted",
        description: `Integration deleted successfully`,
      });
    } catch (e) {
      if (e instanceof Error)
        toast({
          title: `Error deleting integration ${integrationId}`,
          description: `${e.message}`,
        });
    }
  };

  const handleCreate = async (values: CreateIntegrationDto) => {
    try {
      await createIntegrationMutation.mutateAsync({
        workspaceId: workspace.id,
        integration: values,
      });
      toast({
        title: "Integration Created",
        description: `Integration for ${values.model} created successfully`,
      });
    } catch (e) {
      if (e instanceof Error)
        toast({
          title: `Error creating integration`,
          description: `${e.message}`,
        });
    }
  };

  return (
    <>
      <div className="text-xl font-semibold">Integrations Settings</div>
      <CreateIntegrationForm
        workspaceId={workspace.id}
        handleCreate={handleCreate}
        isPending={false}
      />

      <div className="text-lg font-semibold mt-8">Existing Integrations</div>

      {integrationProviders
        .filter((key) => groupedIntegrations && groupedIntegrations[key])
        .map((provider, i) => {
          const integrations = groupedIntegrations![provider];
          return (
            <div className="mt-8" key={i}>
              <div className="font-medium mt-4">
                {humanReadableProvider(provider)} Integrations
              </div>
              {integrations.map((integration, i) => (
                <IntegrationEditForm
                  integration={integration}
                  key={i}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  isPending={updateIntegrationMutation.isPending}
                />
              ))}
            </div>
          );
        })}

      {integrations?.length === 0 && (
        <div className="mt-8">
          <div className="font-medium mt-4">
            No Integrations found. Click on &quot;New Integration&quot; to add
            an AI model to the workspace.
          </div>
        </div>
      )}
    </>
  );
};

export const IntegrationSetting = () => {
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
          title="Integration Settings"
          description="You do not have permission to edit this workspace."
        />
      );
    return <IntegrationSettingForm workspace={currentWorkspace} />;
  }
  return (
    <div>
      <div className="text-xl font-semibold">Integrations Settings</div>
      <Skeleton className="mt-4 h-5 w-[250px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
      <Skeleton className="mt-4 h-5 w-[400px]" />
    </div>
  );
};
