"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { config } from "../config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}
type RegisterData = LoginData;

const postRegister = async (registerData: RegisterData) => {
  try {
    const res = await axios.post<{ id: string }>(
      `${config.baseUrl}/user`,
      registerData
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

const postLogin = async (loginData: LoginData) => {
  try {
    const res = await axios.post<{ access_token: string }>(
      `${config.baseUrl}/login`,
      loginData
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

const RightPanel = () => {
  const { replace } = useRouter();
  const { setToken, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "login") {
      loginMutation.mutate({
        email,
        password,
      });
    } else {
      registerMutation.mutate({
        email,
        password,
      });
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      replace("/");
    }
  }, [isLoggedIn,replace]);

  return (
    <div className="lg:basis-2/3 basis-full min-h-screen flex flex-col">
      {/* Header component */}
      <div className="w-full flex container justify-between my-5">
        <nav className="w-full lg:hidden">
          <Link href="/">
            <div className="font-semibold text-xl">wielded_</div>
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
              : "Login to your account"}
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
                  {loginMutation.error.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {registerMutation.isSuccess && (
            <div className="flex w-full max-w-md items-center space-x-2 my-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Registration Successful</AlertTitle>
                <AlertDescription>Please login below.</AlertDescription>
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
            <Input
              className="mb-4"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="mb-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" type="submit">
              {mode === "register" ? "Sign Up" : "Login"}
            </Button>
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
            <div>
              Don&apos;t have an account?{" "}
              <span
                className="text-muted-foreground cursor-pointer"
                onClick={() => setMode("register")}
              >
                Register
              </span>
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
    <div className="basis-1/3 bg-accent min-h-screen hidden lg:flex flex-col justify-between pb-8">
      <nav className="w-full flex container justify-between my-5">
        <Link href="/">
          <div className="font-semibold text-xl">wielded_</div>
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
