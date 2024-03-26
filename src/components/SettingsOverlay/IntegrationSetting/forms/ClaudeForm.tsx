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

const selectableClaudeModel = [
  "claude-2.1",
  "claude-instant-1.2",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
];
const claudeConfigSchema = z.object({
  model: z.string(),
  apiKey: z.string(),
});

export const ClaudeForm: FunctionComponent<{
  isPending: boolean;
  integration?: IntegrationDto;
  handleSubmit: (values: UpdateIntegrationDto, integrationId?: string) => void;
  handleDelete?: (integrationId: string) => void;
  submitText?: string;
}> = ({ integration, handleSubmit, handleDelete, isPending, submitText }) => {
  const form = useForm<z.infer<typeof claudeConfigSchema>>({
    resolver: zodResolver(claudeConfigSchema),
    defaultValues: {
      model: integration?.model,
      apiKey: integration?.config.apiKey,
    },
  });

  const onSubmit = (values: z.infer<typeof claudeConfigSchema>) => {
    const config = {
      type: "claude",
      apiKey: values.apiKey,
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
                  Select the Claude model you want.
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
                    {selectableClaudeModel.map((model, i) => (
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
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claude API Key</FormLabel>
                <FormDescription>
                  API Key obtained from your Claude console.
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
