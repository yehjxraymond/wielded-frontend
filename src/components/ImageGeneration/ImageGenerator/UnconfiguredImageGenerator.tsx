import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarLayout } from "../../Layout";

export const UnconfiguredImageGenerator = () => {
  return (
    <SidebarLayout title="Welcome to Image Generation">
      <div className="container mt-12 flex  justify-center">
        <div className="max-w-xl mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Image Generation</CardTitle>
              <CardDescription>
                Image generation has not been set up for this workspace.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="text-lg font-medium">
                Integrate Dall-E 3 in your workspace
              </div>
              <p>
                To enable image generation, add a Dall-E 3 integration in your
                workspace.
              </p>
              <p>
                You may set up the integration by visiting the
                &quot;Integrations&quot; tab in &quot;Settings&quot; on the
                sidebar.
              </p>
              <p>
                Select the &quot;OpenAI&quot; provider and choose the DALL-E 3
                model and enter your OpenAI API key to complete the setup.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};
