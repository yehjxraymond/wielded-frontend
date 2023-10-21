"use client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FunctionComponent, ReactNode } from "react";

export const Providers: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
