import { authenticatedAxios } from "@/lib/authenticatedAxios";
import { betterAxiosError } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export enum IntegrationProvider {
  AzureOpenAi = "azure_open_ai",
  OpenAi = "open_ai",
  Claude = "claude",
  AwsBedrock = "aws_bedrock",
}

export const integrationProviders = [
  IntegrationProvider.OpenAi,
  IntegrationProvider.AzureOpenAi,
  IntegrationProvider.Claude,
  IntegrationProvider.AwsBedrock,
];

export interface IntegrationDto {
  id: string;
  workspaceId: string;
  type: "chat" | "image";
  provider: "azure_open_ai" | "open_ai" | "claude" | "aws_bedrock";
  model: string;
  config: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
}

export type UpdateIntegrationDto = Partial<
  Pick<IntegrationDto, "config" | "model">
>;

export type CreateIntegrationDto = Pick<
  IntegrationDto,
  "provider" | "model" | "config" | "type"
> & { workspaceId: string };

const getIntegrations = betterAxiosError(
  async ({ workspaceId }: { workspaceId: string }) => {
    const { data } = await authenticatedAxios.get<IntegrationDto[]>(
      `/workspace/${workspaceId}/integration/config`
    );
    return data;
  }
);

const postIntegration = betterAxiosError(
  async ({
    workspaceId,
    integration,
  }: {
    workspaceId: string;
    integration: CreateIntegrationDto;
  }) => {
    const { data } = await authenticatedAxios.post<IntegrationDto>(
      `/workspace/${workspaceId}/integration`,
      integration
    );
    return data;
  }
);

const putIntegration = betterAxiosError(
  async ({
    workspaceId,
    integrationId,
    integration,
  }: {
    workspaceId: string;
    integrationId: string;
    integration: UpdateIntegrationDto;
  }) => {
    const { data } = await authenticatedAxios.put<IntegrationDto>(
      `/workspace/${workspaceId}/integration/${integrationId}`,
      integration
    );
    return data;
  }
);

const deleteIntegration = betterAxiosError(
  async ({
    workspaceId,
    integrationId,
  }: {
    workspaceId: string;
    integrationId: string;
  }) => {
    const { data } = await authenticatedAxios.delete<IntegrationDto>(
      `/workspace/${workspaceId}/integration/${integrationId}`
    );
    return data;
  }
);

export const useIntegrations = (workspaceId: string) => {
  const integrationsMutation = useMutation({
    mutationFn: getIntegrations,
  });
  const updateIntegrationMutation = useMutation({
    mutationFn: putIntegration,
    onSuccess: () => {
      integrationsMutation.mutate({ workspaceId });
    },
  });
  const deleteIntegrationMutation = useMutation({
    mutationFn: deleteIntegration,
    onSuccess: () => {
      integrationsMutation.mutate({ workspaceId });
    },
  });
  const createIntegrationMutation = useMutation({
    mutationFn: postIntegration,
    onSuccess: () => {
      integrationsMutation.mutate({ workspaceId });
    },
  });
  const mutateIntegration = integrationsMutation.mutate;
  useEffect(() => {
    mutateIntegration({ workspaceId });
  }, [workspaceId, mutateIntegration]);

  return {
    integrationsMutation,
    updateIntegrationMutation,
    deleteIntegrationMutation,
    createIntegrationMutation,
    integrations: integrationsMutation.data,
  };
};
