"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { config } from "../config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
  const { setToken } = useAuth();
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

const LeftPanel = () => {
  return (
    <div className="basis-1/3 bg-accent min-h-screen hidden lg:block">
      <nav className="w-full flex container justify-between my-5">
        <Link href="/">
          <div className="font-semibold text-xl">wielded_</div>
        </Link>
      </nav>
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
