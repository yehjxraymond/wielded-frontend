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
import { LearnMoreOverlay } from "@/components/LearnMoreOverlay";

const selectableOpenAiModel = [
  "gpt-4-1106-preview",
  "gpt-3.5-turbo-1106",
  "dall-e-3",
  "whisper-1",
];
const openAiConfigSchema = z.object({
  model: z.string(),
  apiKey: z.string(),
});

export const OpenAiForm: FunctionComponent<{
  isPending: boolean;
  integration?: IntegrationDto;
  handleSubmit: (values: UpdateIntegrationDto, integrationId?: string) => void;
  handleDelete?: (integrationId: string) => void;
  submitText?: string;
}> = ({ integration, handleSubmit, handleDelete, isPending, submitText }) => {
  const form = useForm<z.infer<typeof openAiConfigSchema>>({
    resolver: zodResolver(openAiConfigSchema),
    defaultValues: {
      model: integration?.model,
      apiKey: integration?.config.apiKey,
    },
  });

  const onSubmit = (values: z.infer<typeof openAiConfigSchema>) => {
    const config = {
      type: "open_ai",
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
          <LearnMoreOverlay
            title="Learn to set up OpenAI integration"
            videoUrl="https://www.youtube-nocookie.com/embed/fohI1KMBsH4?si=mdR4lVA6lHvKWuOr"
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Model Type</FormLabel>
                <FormDescription>
                  Select the OpenAI model you want.
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
                    {selectableOpenAiModel.map((model, i) => (
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
                <FormLabel>OpenAI API Key</FormLabel>
                <FormDescription>
                  API Key obtained from your OpenAI account.
                </FormDescription>
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
