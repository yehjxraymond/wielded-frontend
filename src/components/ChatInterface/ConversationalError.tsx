import { AlertCircle } from "lucide-react";
import { FunctionComponent } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const RectificationMessage: FunctionComponent<{
  error?: string;
  message?: string;
  statusCode?: string | number;
}> = ({ error, message, statusCode }) => {
  if (message === "Missing API Key")
    return (
      <div>
        <AlertTitle>API for Workspace is not set</AlertTitle>
        <AlertDescription>
          <p>An OpenAI API Key has not been set for the workspace</p>
          <p>Please set the API Key in the workspace settings and try again.</p>
          <p>
            If you are not the workspace administrator, please contact your
            administrator to do so.
          </p>
        </AlertDescription>
      </div>
    );
  if (statusCode === "invalid_api_key")
    return (
      <div>
        <AlertTitle>Invalid API Key in Workspace</AlertTitle>
        <AlertDescription>
          <p>The API key you have entered is invalid.</p>
          <p>Please set the API Key in the workspace settings and try again.</p>
          <p>
            If you are not the workspace administrator, please contact your
            administrator to do so.
          </p>
        </AlertDescription>
      </div>
    );
  if (statusCode === "content_policy_violation")
    return (
      <div>
        <AlertTitle>Content Policy Violation</AlertTitle>
        <AlertDescription>
          <p>
            The request you have made violates the content policy of OpenAI.
          </p>
          <p>Please review their content policy and try again.</p>
        </AlertDescription>
      </div>
    );
  if (message?.includes("429")) {
    return (
      <div>
        <AlertTitle>Limit reached</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </div>
    );
  }
  if (error || message)
    return (
      <div>
        <AlertTitle>{error}</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </div>
    );
  return (
    <div>
      <AlertTitle>An unknown error has occurred.</AlertTitle>
      <AlertDescription>
        <p>
          Please try again later or seek help from support to rectify this
          problem.
        </p>
      </AlertDescription>
    </div>
  );
};

export const ConversationalError: FunctionComponent<{
  error?: string;
  message?: string;
  statusCode?: string | number;
}> = ({ error, message, statusCode }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <RectificationMessage
        error={error}
        message={message}
        statusCode={statusCode}
      />
    </Alert>
  );
};
