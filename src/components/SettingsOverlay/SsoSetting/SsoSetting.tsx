import { Workspace, useWorkspace } from "@/context/WorkspaceContext";
import { FunctionComponent, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { NoPermission } from "../NoPermission";
import { SSOConfigurationForm, SsoConfigSchema } from "./SsoConfigurationForm";
import { useSSOConfigurations } from "./useSso";

import { CopyText } from "@/components/CopyText";
import { Button } from "@/components/ui/button";

export const SsoSetupInstructions = () => {
  return (
    <div className="my-6">
      <ul className="list-disc list-inside space-y-2">
        <p>
          <strong>Entity ID:</strong> Use{" "}
          <CopyText text="com.wielded" size="sm" /> for the entity ID for this
          this app (the SP).
        </p>
        <p>
          <strong>ACS URL:</strong> Enter{" "}
          <CopyText
            text="https://api.production.wielded.com/sso/saml/callback"
            size="sm"
          />{" "}
          as the ACS URL.
        </p>
        <p>
          <strong>Start URL/Relay State:</strong> Use the domain segment of your
          email.
        </p>
        <p>
          <strong>Attribute Mapping:</strong> Set up your IdP to map the
          user&apos;s primary email to the <code>email</code> attribute.
        </p>
        <p>
          Once the SAML configuration is complete, enter the following
          information into the Wielded SSO configuration form:
          <ul className="list-disc list-inside space-y-1 mt-2 pl-4">
            <li>Domain (corresponding to the relay state/start URL)</li>
            <li>IDP Issuer ID</li>
            <li>SSO URL</li>
            <li>Certificate</li>
          </ul>
        </p>
      </ul>
      <p className="mt-4">
        Ensure you toggle options for signed assertions and responses to
        maintain security. Enforce SSO and enable auto-provisioning for new
        users as needed.
      </p>
    </div>
  );
};

export const SsoSettingForm: FunctionComponent<{
  workspace: Workspace;
}> = ({ workspace }) => {
  const {
    hasSsoConfig,
    createMutation,
    deleteMutation,
    updateMutation,
    verifyDomainMutation,
    ssoConfig,
  } = useSSOConfigurations(workspace.id);
  const [appState, setAppState] = useState<
    "dashboard" | "create" | "update" | "delete" | "verifyDomain"
  >("dashboard");

  const handleFormSubmit = async (form: SsoConfigSchema) => {
    if (hasSsoConfig) {
      await updateMutation.mutateAsync({
        ssoConfig: form,
        workspaceId: workspace.id,
        samlConfigId: ssoConfig?.id || "",
      });
      setAppState("dashboard");
    } else {
      await createMutation.mutateAsync({
        ssoConfig: { ...form, workspaceId: workspace.id },
        workspaceId: workspace.id,
      });
      setAppState("dashboard");
    }
  };

  const handleDelete = async () => {
    if (ssoConfig) {
      await deleteMutation.mutateAsync({
        workspaceId: workspace.id,
        samlConfigId: ssoConfig.id,
      });
      setAppState("dashboard");
    }
  };

  const handleVerifyDomain = async () => {
    if (ssoConfig) {
      await verifyDomainMutation.mutateAsync({
        workspaceId: workspace.id,
      });
      setAppState("dashboard");
    }
  };

  return (
    <>
      <div className="text-xl font-semibold mb-6">SSO Settings</div>
      {appState === "dashboard" && !hasSsoConfig && (
        <div>
          <Button size="sm" onClick={() => setAppState("create")}>
            Setup SSO
          </Button>
        </div>
      )}
      {appState === "dashboard" && hasSsoConfig && (
        <div className="border p-4 rounded-lg">
          <div className="text-xl font-semibold mb-6">{ssoConfig?.domain}</div>
          <div>IDP: {ssoConfig?.idpIssuer}</div>
          <div>
            Verified Domain:{" "}
            {JSON.stringify(ssoConfig?.domainVerified || false)}
          </div>

          <div className="space-x-2 mt-6">
            <Button
              size="sm"
              onClick={() => setAppState("delete")}
              variant="destructive"
            >
              Delete SSO
            </Button>
            <Button size="sm" onClick={() => setAppState("update")}>
              Edit SSO
            </Button>
            {!ssoConfig?.domainVerified && (
              <Button size="sm" onClick={() => setAppState("verifyDomain")}>
                Verify Domain
              </Button>
            )}
          </div>
        </div>
      )}
      {(appState === "create" || appState === "update") && (
        <SsoSetupInstructions />
      )}
      {appState === "create" && (
        <SSOConfigurationForm
          isPending={createMutation.isPending}
          handleSubmit={handleFormSubmit}
          handleCancel={() => setAppState("dashboard")}
        />
      )}
      {appState === "update" && (
        <SSOConfigurationForm
          isPending={updateMutation.isPending}
          handleSubmit={handleFormSubmit}
          handleCancel={() => setAppState("dashboard")}
          ssoConfig={ssoConfig}
        />
      )}
      {appState === "delete" && (
        <div>
          <p>Are you sure you want to delete the SSO configuration?</p>
          <p>This action cannot be undone.</p>
          <div className="space-x-2 mt-6">
            <Button size="sm" onClick={handleDelete} variant="destructive">
              Delete
            </Button>
            <Button size="sm" onClick={() => setAppState("dashboard")}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {appState === "verifyDomain" && (
        <div className="space-y-4">
          <p>Verify domain ownership to enable the SSO.</p>
          <p>
            You may verify the ownership of the domain by adding the following
            TXT records to{" "}
            <span className="font-medium">{ssoConfig?.domain}</span>:
          </p>
          <p>
            <CopyText text={`WIELDED:${ssoConfig?.id}`} />
          </p>
          <div className="space-x-2 mt-6">
            <Button
              size="sm"
              onClick={handleVerifyDomain}
              variant="destructive"
            >
              Verify
            </Button>
            <Button size="sm" onClick={() => setAppState("dashboard")}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export const SsoSetting = () => {
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
    return <SsoSettingForm workspace={currentWorkspace} />;
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
