import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const supabase = createClient(
  "https://bjxbwygfelodmhrfswzi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqeGJ3eWdmZWxvZG1ocmZzd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTEzMzYsImV4cCI6MjA0OTE4NzMzNn0.eSnys2ExcBmEeOJKHnt3DXBlpZLDhWN0kRUiOr34SvQ"
);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};