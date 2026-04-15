"use client";

import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";

interface AuthContextType {
  isSessionExpired: boolean;
  setSessionExpired: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isSessionExpired: false,
  setSessionExpired: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [isSessionExpired, setSessionExpired] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof Error && error.message === "session_expired") {
              setSessionExpired(true);
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message === "session_expired") {
                return false;
              }
              return failureCount < 3;
            },
            staleTime: 10_000,
          },
        },
      })
  );

  return (
    <AuthContext.Provider value={{ isSessionExpired, setSessionExpired }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
