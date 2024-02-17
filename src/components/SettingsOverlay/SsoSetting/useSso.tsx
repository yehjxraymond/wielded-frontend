import { authenticatedAxios } from "@/lib/authenticatedAxios";
import { betterAxiosError } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export interface SSOConfigurationDto {
  id: string;
  workspaceId: string;
  domain: string;
  domainVerified: boolean;
  idpIssuer: string;
  ssoUrl: string;
  publicCertificate: string;
  signedAssertions: boolean;
  signedResponse: boolean;
  enforceSso: boolean;
  autoProvision: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UpdateSSOConfigDto = Partial<
  Omit<SSOConfigurationDto, "id" | "workspaceId" | "createdAt" | "updatedAt">
>;
export type CreateSSOConfigDto = Omit<
  SSOConfigurationDto,
  "id" | "createdAt" | "updatedAt" | "domainVerified"
>;

const getSsoConfig = betterAxiosError(async (workspaceId: string) => {
  const { data } = await authenticatedAxios.get<SSOConfigurationDto>(
    `/workspace/${workspaceId}/saml-configuration`
  );
  return data;
});

const postSsoConfig = betterAxiosError(
  async (params: { workspaceId: string; ssoConfig: CreateSSOConfigDto }) => {
    const { data } = await authenticatedAxios.post<SSOConfigurationDto>(
      `/workspace/${params.workspaceId}/saml-configuration`,
      params.ssoConfig
    );
    return data;
  }
);

const verifyDomain = betterAxiosError(
  async (params: { workspaceId: string }) => {
    const { data } = await authenticatedAxios.post<{ success: boolean }>(
      `/workspace/${params.workspaceId}/saml-configuration/verify-domain`
    );
    return data;
  }
);

const putSsoConfig = betterAxiosError(
  async (params: {
    workspaceId: string;
    samlConfigId: string;
    ssoConfig: UpdateSSOConfigDto;
  }) => {
    const { data } = await authenticatedAxios.put<SSOConfigurationDto>(
      `/workspace/${params.workspaceId}/saml-configuration/${params.samlConfigId}`,
      params.ssoConfig
    );
    return data;
  }
);

const deleteSsoConfig = betterAxiosError(
  async (params: { workspaceId: string; samlConfigId: string }) => {
    await authenticatedAxios.delete<SSOConfigurationDto>(
      `/workspace/${params.workspaceId}/saml-configuration/${params.samlConfigId}`
    );
  }
);

export const useSSOConfigurations = (workspaceId: string) => {
  const ssoConfigQuery = useMutation({
    mutationFn: () => getSsoConfig(workspaceId),
  });

  const fetchSsoConfig = ssoConfigQuery.mutate;

  const createMutation = useMutation({
    mutationFn: postSsoConfig,
    onSuccess: () => fetchSsoConfig(),
  });

  const updateMutation = useMutation({
    mutationFn: putSsoConfig,
    onSuccess: () => fetchSsoConfig(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSsoConfig,
    onSuccess: () => fetchSsoConfig(),
  });

  const verifyDomainMutation = useMutation({
    mutationFn: verifyDomain,
    onSuccess: () => fetchSsoConfig(),
  });

  useEffect(() => {
    if (workspaceId) {
      fetchSsoConfig();
    }
  }, [workspaceId, fetchSsoConfig]);

  const hasSsoConfig = !(
    ssoConfigQuery.error?.message.includes("SAML Configuration not found") ||
    false
  );

  return {
    ssoConfig: ssoConfigQuery.data,
    hasSsoConfig,
    isFetching: ssoConfigQuery.isPending,
    isError: ssoConfigQuery.isError,
    createMutation,
    updateMutation,
    deleteMutation,
    verifyDomainMutation,
  };
};
