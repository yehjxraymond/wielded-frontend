"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useUTMParameters } from "@/context/UTMContext";
import { betterAxiosError } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { gtmEvent } from "../Analytics";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSsoCheck } from "./useSsoCheck";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  source?: string;
  utm_parameters?: object;
}

const postRegister = betterAxiosError(async (registerData: RegisterData) => {
  const res = await axios.post<{ id: string }>(
    `${config.baseUrl}/user`,
    registerData
  );
  await gtmEvent({
    event: "register_account",
    source: registerData.source,
  });
  return res.data;
});

const verifyEmail = betterAxiosError(async (token: string) => {
  const res = await axios.get<{ success: boolean }>(
    `${config.baseUrl}/user/verify?token=${token}`
  );
  return res.data;
});

const postResendVerificationEmail = betterAxiosError(async (email: string) => {
  const res = await axios.post<{ success: boolean }>(
    `${config.baseUrl}/user/resend-verification`,
    { email }
  );
  return res.data;
});

const postLogin = betterAxiosError(async (loginData: LoginData) => {
  const res = await axios.post<{ access_token: string }>(
    `${config.baseUrl}/login`,
    loginData
  );
  return res.data;
});

const postForgetPassword = betterAxiosError(async (email: string) => {
  const res = await axios.post<{ success: boolean }>(
    `${config.baseUrl}/user/initiate-password-reset`,
    { email }
  );
  return res.data;
});

const postPasswordReset = betterAxiosError(
  async (data: { token: string; password: string }) => {
    const res = await axios.post<{ success: boolean }>(
      `${config.baseUrl}/user/reset-password`,
      data
    );
    return res.data;
  }
);

type AppMode =
  | "register"
  | "login"
  | "resendVerification"
  | "forget-password"
  | "password-reset";

const RightPanel = () => {
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const { setToken, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<AppMode>(
    (searchParams.get("mode") as AppMode) || "register"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ssoState = useSsoCheck({ email });
  const { getUTMParameters } = useUTMParameters();

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      setToken(data.access_token);
    },
  });
  const registerMutation = useMutation({
    mutationFn: postRegister,
    onSuccess: () => {
      setMode("login");
    },
  });
  const verificationMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      setMode("login");
    },
    onError: () => {
      setMode("resendVerification");
    },
  });
  const forgetPasswordMutation = useMutation({
    mutationFn: postForgetPassword,
  });
  const passwordResetMutation = useMutation({
    mutationFn: postPasswordReset,
    onSuccess: () => {
      setMode("login");
    },
  });
  const mutateVerification = verificationMutation.mutate;
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    verificationMutation.isPending ||
    forgetPasswordMutation.isPending ||
    passwordResetMutation.isPending;

  const resendVerificationEmailMutation = useMutation({
    mutationFn: postResendVerificationEmail,
  });
  const verificationToken = searchParams.get("verification_token");
  const passwordResetToken = searchParams.get("password_reset_token");

  // Handle verification when the verification token exists in the URL
  useEffect(() => {
    if (verificationToken) {
      mutateVerification(verificationToken);
    }
  }, [verificationToken, mutateVerification]);

  const loginViaSso = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (ssoState.state === "success" && ssoState.isSsoEnabled) {
      const redirectUrl = `${config.baseUrl}/sso/saml/login?email=${email}`;
      push(redirectUrl);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "login") {
      loginMutation.mutate({
        email: email.toLowerCase(),
        password,
      });
    } else if (mode === "register") {
      const utm_parameters = await getUTMParameters();
      registerMutation.mutate({
        email: email.toLowerCase(),
        password,
        source: searchParams.get("source") || "login_page",
        utm_parameters,
      });
    } else if (mode === "resendVerification") {
      resendVerificationEmailMutation.mutate(email.toLowerCase());
    } else if (mode === "forget-password") {
      forgetPasswordMutation.mutate(email.toLowerCase());
    } else {
      if (!passwordResetToken) return alert("Password reset token not found!");
      passwordResetMutation.mutate({
        token: passwordResetToken,
        password,
      });
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      replace("/");
    }
  }, [isLoggedIn, replace]);

  return (
    <div className="lg:basis-2/3 basis-full min-h-screen flex flex-col">
      {/* Header component */}
      <div className="w-full flex container justify-between my-5">
        <nav className="w-full lg:hidden">
          <Link href="/">
            <div className="font-semibold text-xl">Wielded</div>
          </Link>
        </nav>
        <div className="hidden lg:block" />
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-xl font-medium mb-8">
            {mode === "register"
              ? "Create an account"
              : mode === "login"
              ? "Login to your account"
              : mode === "resendVerification"
              ? "Re-send Verification Email"
              : mode === "forget-password"
              ? "Forget Password"
              : "Reset Password"}
          </h1>
          {registerMutation.error && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {registerMutation.error.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {loginMutation.error && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <p>{loginMutation.error.message}</p>
                  {loginMutation.error.message ===
                    "Email address has not been verified." && (
                    <p
                      className="underline cursor-pointer"
                      onClick={() => setMode("resendVerification")}
                    >
                      Resend verification email
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {resendVerificationEmailMutation.error && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {resendVerificationEmailMutation.error.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {verificationMutation.error && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Email Verification Error</AlertTitle>
                <AlertDescription>
                  <p>
                    The verification token is invalid or has expired. Your email
                    might have also been verified. Please try logging in or
                    request for a new verification token.
                  </p>
                  <p
                    className="underline cursor-pointer"
                    onClick={() => {
                      setMode("login");
                      verificationMutation.reset();
                    }}
                  >
                    Try logging in
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}
          {resendVerificationEmailMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Verification Email Sent</AlertTitle>
                <AlertDescription>
                  Please check your email for the verification email.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {forgetPasswordMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Reset Password Email Sent</AlertTitle>
                <AlertDescription>
                  Please check your email for the password reset email.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {passwordResetMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Password Reset Successfully</AlertTitle>
                <AlertDescription>
                  Login with your new password to proceed.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {passwordResetMutation.error && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Password Reset Error</AlertTitle>
                <AlertDescription>
                  {passwordResetMutation.error.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {forgetPasswordMutation.error && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Forget Password Error</AlertTitle>
                <AlertDescription>
                  {forgetPasswordMutation.error.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {registerMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Registration Successful</AlertTitle>
                <AlertDescription>
                  Please verify your email before logging in. The verification
                  email has been sent to your email.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {verificationMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Email Verified</AlertTitle>
                <AlertDescription>
                  Email is verified. You may now login below.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {loginMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Login Successful</AlertTitle>
                <AlertDescription>
                  Please wait to be redirected.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <form onSubmit={onSubmit}>
            {mode !== "password-reset" && (
              <Input
                className="mb-4"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {!(ssoState.state === "success" && ssoState.isSsoEnforced) &&
              mode !== "resendVerification" &&
              mode !== "forget-password" && (
                <Input
                  className="mb-4"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            {ssoState.state === "success" && ssoState.isSsoEnabled && (
              <Button
                className="w-full mt-4"
                onClick={loginViaSso}
                disabled={isLoading}
              >
                Login (SSO)
              </Button>
            )}
            {!(ssoState.state === "success" && ssoState.isSsoEnforced) && (
              <Button
                className="w-full mt-4"
                type="submit"
                disabled={
                  isLoading ||
                  (ssoState.state === "pending" && mode === "login")
                }
              >
                {mode === "register" && "Sign Up"}
                {mode === "forget-password" && "Reset Password"}
                {mode === "password-reset" && "Reset Password"}
                {mode === "login" &&
                  (ssoState.state === "success" && ssoState.isSsoEnabled
                    ? "Login (Password)"
                    : "Login")}
                {mode === "resendVerification" && "Resend Verification Email"}
              </Button>
            )}
          </form>
          <div className="h-8" />
        </div>
        <div>
          {mode === "register" && (
            <div>
              Already have an account?{" "}
              <span
                className="text-muted-foreground cursor-pointer"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </div>
          )}
          {mode === "login" && (
            <div className="text-center">
              <div>
                Don&apos;t have an account?{" "}
                <span
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => setMode("register")}
                >
                  Register
                </span>
              </div>
              <div>
                Forgot your password?{" "}
                <span
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => setMode("forget-password")}
                >
                  Reset Password
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="h-32" />
      </div>
    </div>
  );
};

const quotes = [
  {
    quote:
      "Artificial Intelligence is not man versus machines. It is man with machines. ",
    person: "Satya Nadella",
  },
  {
    quote:
      "The key to artificial intelligence has always been the representation. ",
    person: "Jeff Hawkins",
  },
  {
    quote:
      "Machine intelligence is the last invention that humanity will ever need to make. ",
    person: "Nick Bostrom",
  },
  {
    quote:
      "Artificial Intelligence, deep learning, machine learning — whatever you're doing if you don't understand it — learn it. Because otherwise you're going to be a dinosaur within 3 years. ",
    person: "Mark Cuban",
  },
  {
    quote:
      "AI does not keep me up at night. Car accidents keep me up at night. ",
    person: "Andrew Ng",
  },
  {
    quote:
      "The advent of AI is not a disaster, but rather a great opportunity for humanity. ",
    person: "Fei-Fei Li",
  },
  {
    quote:
      "The ability of AI to improve over time as it ingests more data will create a virtuosity cycle. ",
    person: "Satya Nadella",
  },
  {
    quote:
      "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim. ",
    person: "Edsger W. Dijkstra",
  },
  {
    quote:
      "AI is going to be extremely beneficial, and already is, to the field of healthcare. ",
    person: "Mark Zuckerberg",
  },
  {
    quote:
      "If you don't have an AI strategy, you are going to die in the world that's coming. ",
    person: "Devin Wenig",
  },
  {
    quote:
      "Rule-based systems are useful for straightforward or simple tasks but quickly become unmanageable for more complex problems. ",
    person: "John McCarthy",
  },
  {
    quote: "AI is like magic, and who doesn't like magic? ",
    person: "Yann LeCun",
  },
  {
    quote:
      "Creating a digital twin is only the beginning of the journey toward an intelligent system. ",
    person: "Stephen P. Boyd",
  },
  {
    quote:
      "If we can keep the cost of AI low, we can make its benefits universal. ",
    person: "Reid Hoffman",
  },
  {
    quote: "The most powerful element of AI is that it can learn and adapt. ",
    person: "Sundar Pichai",
  },
  {
    quote: "Preparing ourselves for the future means understanding AI. ",
    person: "Sebastian Thrun",
  },
  {
    quote:
      "Human intelligence combined with AI will be significantly more powerful than either alone. ",
    person: "Elon Musk",
  },
  {
    quote:
      "Never underestimate the power of a few committed people to change the world. Indeed, it is the only thing that ever has. ",
    person: "Margaret Mead, AI version",
  },
  {
    quote:
      "The future is not something we enter. The future is something we create. ",
    person: "Leonard I. Sweet, AI version",
  },
  {
    quote:
      "AI will touch everybody, enabling new levels of productivity, enhancing creativity and creating new fields of work. ",
    person: "Rana el Kaliouby",
  },
];

const useRandomQuote = () => {
  const [quote, setQuote] = useState({
    quote: "Loading...",
    person: "Loading...",
  });
  const setRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };
  useEffect(() => {
    setRandomQuote();
    const interval = setInterval(() => {
      setRandomQuote();
    }, 10000);
    return () => clearInterval(interval);
  });
  return quote;
};

const LeftPanel = () => {
  const quote = useRandomQuote();
  return (
    <div className="basis-1/3 bg-secondary min-h-screen hidden lg:flex flex-col justify-between pb-8">
      <nav className="w-full flex container justify-between my-5">
        <Link href="/">
          <div className="font-semibold text-xl">Wielded</div>
        </Link>
      </nav>
      <div className="container text-muted-foreground text-right flex flex-col items-end w-full">
        <div className="text-xl font-medium max-w-lg">
          &quot;{quote.quote}&quot;
        </div>
        <div className="text-sm mt-2">{quote.person}</div>
      </div>
    </div>
  );
};

export const Authentication = () => {
  return (
    <div className="flex">
      <LeftPanel />
      <RightPanel />
    </div>
  );
};
