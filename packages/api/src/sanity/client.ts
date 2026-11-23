import {
  type ClientConfig,
  createClient,
  type QueryParams,
  type SanityClient,
} from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const getSanityConfig = () => {
  if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");

  return {
    apiVersion: "2025-02-28",
    dataset: dataset || "production",
    projectId: projectId,
    useCdn: true,
  } satisfies ClientConfig;
};

export const sanityClient = createClient(getSanityConfig());

type DraftModeOptions = {
  isEnabled: () => Promise<boolean>;
  studioUrl: string;
  // A Viewer token: configure this from server code only.
  token: string;
};

type DraftMode = {
  client: SanityClient;
  isEnabled: () => Promise<boolean>;
};

let draftMode: DraftMode | undefined;

export const createDraftClient = (
  client: SanityClient,
  { studioUrl, token }: Omit<DraftModeOptions, "isEnabled">,
) =>
  client.withConfig({
    perspective: "drafts",
    stega: { enabled: true, studioUrl },
    token,
    useCdn: false,
  });

export const configureDraftMode = ({
  isEnabled,
  ...options
}: DraftModeOptions) => {
  draftMode = {
    client: createDraftClient(sanityClient, options),
    isEnabled,
  };
};

export const resetDraftMode = () => {
  draftMode = undefined;
};

export const isDraftMode = async () =>
  draftMode ? draftMode.isEnabled() : false;

export const getClient = async (): Promise<SanityClient> =>
  draftMode && (await draftMode.isEnabled()) ? draftMode.client : sanityClient;

// A draft that fails validation (an unfilled required field, or a stega-encoded
// enum) retries unencoded, then as published, so it can't crash the page.
export const sanityFetch = async <T>(
  query: string,
  parse: (data: unknown) => T,
  params: QueryParams = {},
): Promise<T> => {
  const client = await getClient();

  if (client === sanityClient) return parse(await client.fetch(query, params));

  const attempts: SanityClient[] = [
    client,
    client.withConfig({ stega: false }),
    sanityClient,
  ];

  let lastError: unknown;

  for (const attempt of attempts) {
    try {
      return parse(await attempt.fetch(query, params));
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};
