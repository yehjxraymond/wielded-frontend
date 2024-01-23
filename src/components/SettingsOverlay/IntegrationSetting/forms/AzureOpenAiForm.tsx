import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { humanReadableModel } from "../humanReadableNames";
import { IntegrationDto, UpdateIntegrationDto } from "../useIntegrations";

const selectableAzureOpenAiModel = ["gpt-4-1106-preview", "gpt-3.5-turbo-1106"];

const azureOpenAiConfigSchema = z.object({
  model: z.string(),
  apiKey: z.string(),
  baseUrl: z.string(),
  deploymentName: z.string(),
});

export const AzureOpenAiForm: FunctionComponent<{
  isPending: boolean;
  integration?: IntegrationDto;
  handleSubmit: (values: UpdateIntegrationDto, integrationId?: string) => void;
  handleDelete?: (integrationId: string) => void;
  submitText?: string;
}> = ({ integration, handleSubmit, handleDelete, isPending, submitText }) => {
  const form = useForm<z.infer<typeof azureOpenAiConfigSchema>>({
    resolver: zodResolver(azureOpenAiConfigSchema),
    defaultValues: {
      model: integration?.model,
      apiKey: integration?.config.apiKey,
      baseUrl: integration?.config.baseUrl,
      deploymentName: integration?.config.deploymentName,
    },
  });
  const onSubmit = (values: z.infer<typeof azureOpenAiConfigSchema>) => {
    const config = {
      type: "azure_open_ai",
      apiKey: values.apiKey,
      baseUrl: values.baseUrl,
      deploymentName: values.deploymentName,
    };
    const model = values.model;
    handleSubmit({ config, model }, integration?.id);
  };
  const onDelete = () => {
    if (
      handleDelete &&
      integration &&
      window.confirm("Are you sure you want to delete this integration?")
    ) {
      handleDelete(integration.id);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Model Type</FormLabel>
                <FormDescription>
                  Select the model type matching your model deployment. Found in
                  Azure OpenAI Studio under Management &gt; Deployments.
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectableAzureOpenAiModel.map((model, i) => (
                      <SelectItem value={model} key={i}>
                        {humanReadableModel(model)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Azure Endpoint</FormLabel>
                <FormDescription>
                  Endpoint URL obtained from &apos;Keys and Endpoint&apos; tab
                  of your Azure Portal. Make sure that a model has been
                  deployed.
                </FormDescription>
                <FormDescription>
                  The URL should be in the format
                  https://&lt;REGION&gt;.openai.azure.com/openai/deployments/
                </FormDescription>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="https://<REGION>.openai.azure.com/openai/deployments/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deploymentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Azure Deployment Name</FormLabel>
                <FormDescription>
                  Deployment name of your model. Found in Azure OpenAI Studio
                  under Management &gt; Deployments.
                </FormDescription>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="model-deployment-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Azure API Key</FormLabel>
                <FormDescription>
                  API Key obtained from &apos;Keys and Endpoint&apos; tab of
                  your Azure Portal. Make sure that a model has been deployed.
                </FormDescription>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-x-4">
            {handleDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isPending}
              >
                Delete
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {submitText || "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
