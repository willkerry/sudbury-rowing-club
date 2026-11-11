const unavailable = (binding: string) => () => {
  throw new Error(`The ${binding} binding is not available in tests`);
};

export const waitUntil = (promise: Promise<unknown>) => {
  void promise;
};

export const env = {
  ASSETS: { fetch: unavailable("ASSETS") },
  CF_VERSION_METADATA: { id: "test" },
  DB: { prepare: unavailable("DB") },
  RATE_LIMITER: { limit: unavailable("RATE_LIMITER") },
  DATA_CACHE: {
    delete: unavailable("DATA_CACHE"),
    get: unavailable("DATA_CACHE"),
    put: unavailable("DATA_CACHE"),
  },
};
