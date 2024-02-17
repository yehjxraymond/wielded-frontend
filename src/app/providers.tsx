"use client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ConversationProvider } from "@/context/ConversationContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { UTMProvider } from "@/context/UTMContext";
import { UserProvider } from "@/context/UserContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FunctionComponent, ReactNode } from "react";
import { ActiveWorkspaceProvider } from "@/context/ActiveWorkspaceContext";
import { FlagsProvider } from "@/components/FeatureFlag/FlagsContext";

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
            <UserProvider>
              <WorkspaceProvider>
                <ActiveWorkspaceProvider>
                  <ConversationProvider>
                    <PersonaProvider>
                      <FlagsProvider localStorageOverride>
                        {children}
                      </FlagsProvider>
                      <Toaster />
                    </PersonaProvider>
                  </ConversationProvider>
                </ActiveWorkspaceProvider>
              </WorkspaceProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </UTMProvider>
    </QueryClientProvider>
  );
};
