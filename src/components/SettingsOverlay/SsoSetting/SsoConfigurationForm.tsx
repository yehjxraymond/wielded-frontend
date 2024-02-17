import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SSOConfigurationDto } from "./useSso";

const ssoConfigSchema = z.object({
  domain: z.string(),
  idpIssuer: z.string(),
  ssoUrl: z.string(),
  publicCertificate: z.string(),
  signedAssertions: z.boolean(),
  signedResponse: z.boolean(),
  enforceSso: z.boolean(),
  autoProvision: z.boolean(),
});

export type SsoConfigSchema = z.infer<typeof ssoConfigSchema>;

export const SSOConfigurationForm: FunctionComponent<{
  isPending: boolean;
  ssoConfig?: Partial<SSOConfigurationDto>;
  handleSubmit: (values: SsoConfigSchema) => void;
  handleCancel?: () => void;
}> = ({ ssoConfig, handleSubmit, isPending, handleCancel }) => {
  const form = useForm<SsoConfigSchema>({
    resolver: zodResolver(ssoConfigSchema),
    defaultValues: {
      domain: ssoConfig?.domain,
      idpIssuer: ssoConfig?.idpIssuer,
      ssoUrl: ssoConfig?.ssoUrl,
      publicCertificate: ssoConfig?.publicCertificate,
      signedAssertions: ssoConfig?.signedAssertions || true,
      signedResponse: ssoConfig?.signedResponse || false,
      enforceSso: ssoConfig?.enforceSso || false,
      autoProvision: ssoConfig?.autoProvision || false,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormDescription>
                  Email domain to enable the SSO for
                </FormDescription>
                <FormMessage />
                <FormControl>
                  <Input {...field} placeholder="example.com" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idpIssuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IDP Entity ID</FormLabel>
                <FormDescription>Entity ID from your IdP</FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/saml/idp"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ssoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSO URL</FormLabel>
                <FormDescription>
                  Single Sign-On service URL provided by your IdP
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/saml/sso"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicCertificate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Certificate</FormLabel>
                <FormDescription>
                  The X.509 public certificate provided by your IdP
                </FormDescription>
                <FormControl>
                  <Textarea
                    rows={4}
                    {...field}
                    placeholder={`-----BEGIN CERTIFICATE-----\n...\n...\n-----END CERTIFICATE-----`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="signedAssertions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signed Assertions</FormLabel>
                <div className="flex justify-between">
                  <FormDescription>
                    Validate the integrity of SAML assertions
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="signedResponse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signed Response</FormLabel>
                <div className="flex justify-between">
                  <FormDescription>
                    Validate the integrity of the entire SAML response
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enforceSso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enforce SSO</FormLabel>
                <div className="flex justify-between">
                  <FormDescription>
                    <p>Enforce Single Sign-On for all emails in the domain</p>
                    <p>
                      Warning: Do not turn this on until SSO setup is complete
                      to prevent locking yourself out
                    </p>
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoProvision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auto Provision Users</FormLabel>
                <div className="flex justify-between">
                  <FormDescription>
                    Automatically add new users with the specified domain email
                    to this workspace
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="space-x-2">
            <Button size="sm" onClick={handleCancel}>
              Go Back
            </Button>
            <Button size="sm" type="submit" disabled={isPending}>
              Save Configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
