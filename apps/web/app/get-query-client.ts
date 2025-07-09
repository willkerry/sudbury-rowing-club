import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import ky from "ky";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export const kyInstance = ky.create({
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error;

        if (response?.body) {
          try {
            const errorMessage = await response.text();
            error.message = errorMessage || response.statusText;
          } catch (e: unknown) {
            console.error(e);
          }
        }

        return error;
      },
    ],
  },
});
