import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { config } from "../../config";

interface LeadData {
  email: string;
  first_name?: string;
  last_name?: string;
  source?: string;
  utm_parameters?: object;
}

const postLead = async (leadData: LeadData) => {
  try {
    const res = await axios.post<{ success: boolean }>(
      `${config.baseUrl}/lead`,
      leadData
    );
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      const data = e.response?.data;
      if (data.message) {
        throw new Error(data.message);
      }
    }
    throw e;
  }
};

export const HomeHero = () => {
  const [email, setEmail] = useState("");
  const mutation = useMutation<{ success: boolean }, AxiosError, LeadData>({
    mutationFn: postLead,
  });
  const isSubmissionSuccessful = mutation.data?.success;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email, source: "wielded_waitlist_hero" });
  };
  return (
    <div className="container flex-grow flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold text-center max-w-sm md:max-w-none">
        Supercharge your team with AI
      </h1>
      <h2 className="text-muted-foreground font-medium mt-2 text-center">
        Join the early access waitlist
      </h2>

      {mutation.error && (
        <div className="flex w-full max-w-md items-center space-x-2 mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        </div>
      )}
      {!isSubmissionSuccessful && (
        <form
          className="flex w-full max-w-md items-center space-x-2 mt-8"
          onSubmit={onSubmit}
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            className="whitespace-nowrap"
            disabled={mutation.isPending}
          >
            Join Waitlist
          </Button>
        </form>
      )}

      {isSubmissionSuccessful && (
        <div className="w-full max-w-md space-x-2 mt-8">
          <h3 className="text-center font-semibold">
            Thank you for joining the waitlist!
          </h3>
        </div>
      )}

      <div className="my-20" />
    </div>
  );
};
