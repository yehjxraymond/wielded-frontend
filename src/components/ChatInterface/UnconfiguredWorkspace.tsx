import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarLayout } from "../Layout";

export const UnconfiguredWorkspace = () => {
  return (
    <SidebarLayout title="Welcome to Wielded">
      <div className="container mt-12 flex  justify-center">
        <div className="max-w-xl mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your new workspace</CardTitle>
              <CardDescription>
                This workspace needs to be configured with an AI model before
                you can start using it. As an admin, you need to configure your
                workspace to start using it. Alternatively if you were invited
                as an user to this workspace, please contact your admin to
                complete the setup.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="text-lg font-medium">1. Integrate AI models</div>
              <p>
                Wielded works with any of the following AI models & providers:
              </p>
              <ul className="list-disc list-inside">
                <li>OpenAI</li>
                <li>Microsoft Azure</li>
                <li>Anthropic</li>
                <li>AWS Bedrock</li>
              </ul>
              <p>
                You may set up the integration by visiting the
                &quot;Integrations&quot; tab in &quot;Settings&quot; on the
                sidebar.
              </p>
              <div className="text-lg font-medium">2. Invite your team</div>
              <p>
                To allow your team members to access the workspace, you can
                subscribe to the team plan by visiting the &quot;Billing&quot;
                tab in &quot;Settings&quot; on the sidebar.
              </p>
              <p>
                Once you&apos;ve subscribe to the team plan, you may invite your
                team members onto this workspace by visiting the
                &quot;Members&quot; tab in the settings page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};
