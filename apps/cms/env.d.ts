interface ImportMetaEnv {
  readonly SANITY_STUDIO_PREVIEW_URL?: string;
  readonly SANITY_STUDIO_PR_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
