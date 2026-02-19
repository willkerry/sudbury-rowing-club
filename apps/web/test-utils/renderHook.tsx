import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook as originalRenderHook } from "@testing-library/react";
import type React from "react";

interface TestProvidersProps {
  children: React.ReactNode;
}

interface RenderHookOptions {
  queryClient?: QueryClient;
  // Add more provider options here in the future
  // e.g., theme?: Theme;
  // e.g., user?: User;
}

const createDefaultQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });

const TestProviders: React.FC<TestProvidersProps & RenderHookOptions> = ({
  children,
  queryClient = createDefaultQueryClient(),
  // Add more providers here as needed
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Add more providers here in the future */}
      {children}
    </QueryClientProvider>
  );
};

/**
 * Custom renderHook that wraps hooks with necessary providers
 * @param callback - The hook to render
 * @param options - Optional configuration for providers
 * @returns The result from @testing-library/react renderHook
 */
export const renderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options: RenderHookOptions & { initialProps?: TProps } = {},
) => {
  const { queryClient, initialProps, ...restOptions } = options;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestProviders queryClient={queryClient}>{children}</TestProviders>
  );

  return originalRenderHook(callback, {
    wrapper,
    initialProps,
    ...restOptions,
  });
};
