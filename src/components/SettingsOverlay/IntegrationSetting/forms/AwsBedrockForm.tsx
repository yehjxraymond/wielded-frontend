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
import { IntegrationDto, UpdateIntegrationDto } from "../useIntegrations";
import { humanReadableModel } from "../humanReadableNames";

const selectableAwsBedrockModel = [
  "anthropic.claude-instant-v1",
  "anthropic.claude-v2:1",
];

const awsBedrockConfigSchema = z.object({
  model: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  region: z.string(),
});

export const AwsBedrockForm: FunctionComponent<{
  isPending: boolean;
  integration?: IntegrationDto;
  handleSubmit: (values: UpdateIntegrationDto, integrationId?: string) => void;
  handleDelete?: (integrationId: string) => void;
  submitText?: string;
}> = ({ integration, handleSubmit, handleDelete, isPending, submitText }) => {
  const form = useForm<z.infer<typeof awsBedrockConfigSchema>>({
    resolver: zodResolver(awsBedrockConfigSchema),
    defaultValues: {
      model: integration?.model,
      accessKey: integration?.config.accessKey,
      secretKey: integration?.config.secretKey,
      region: integration?.config.region,
    },
  });
  const onSubmit = (values: z.infer<typeof awsBedrockConfigSchema>) => {
    const config = {
      type: "aws_bedrock",
      accessKey: values.accessKey,
      secretKey: values.secretKey,
      region: values.region,
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
                <FormLabel>Foundation Model Type</FormLabel>
                <FormDescription>
                  Select the model type matching foundation model on AWS
                  Bedrock. You may need to request for access for the models.
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
                    {selectableAwsBedrockModel.map((model, i) => (
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
            name="accessKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AWS Access Key</FormLabel>
                <FormDescription>
                  Obtain the access key and secret key from AWS IAM
                </FormDescription>
                <FormControl>
                  <Input type="text" placeholder="Access Key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secretKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AWS Secret Key</FormLabel>
                <FormDescription>
                  Obtain the access key and secret key from AWS IAM
                </FormDescription>
                <FormControl>
                  <Input type="password" placeholder="Secret Key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AWS Region</FormLabel>
                <FormDescription>
                  AWS region where you have been granted access from
                </FormDescription>
                <FormControl>
                  <Input type="text" placeholder="Region" {...field} />
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
