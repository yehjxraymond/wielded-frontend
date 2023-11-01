"use client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ConversationProvider } from "@/context/ConversationContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { UTMProvider } from "@/context/UTMContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FunctionComponent, ReactNode } from "react";

export const Providers: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UTMProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <WorkspaceProvider>
              <ConversationProvider>
                <PersonaProvider>{children}</PersonaProvider>
              </ConversationProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </ThemeProvider>
      </UTMProvider>
    </QueryClientProvider>
  );
};
