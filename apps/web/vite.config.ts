import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import mdx from "@mdx-js/rollup";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { workersCacheCdnAdapter } from "@vinext/cloudflare/cache/workers-cache-cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import {
  remarkAdmonition,
  remarkGfm,
  remarkHeading,
} from "fumadocs-core/mdx-plugins";
import remarkFrontmatter from "remark-frontmatter";
import remarkSmartypants from "remark-smartypants";
import vinext from "vinext";
import { defineConfig, type Plugin } from "vite";

const require = createRequire(import.meta.url);

// The browser loads the MapTiler SDK from its CDN (lib/load-maptiler-sdk.ts);
// pin that to the installed devDependency so runtime and types agree.
const maptilerSdkVersion: string = JSON.parse(
  readFileSync(
    new URL("./node_modules/@maptiler/sdk/package.json", import.meta.url),
    "utf8",
  ),
).version;

// @react-email/render statically imports prettier for its opt-in `pretty`
// option, which we never use. Stub it out of the server bundles.
const PRETTIER_STUB_ID = "\0prettier-stub";
const stubPrettier = (): Plugin => ({
  enforce: "pre",
  name: "stub-prettier",
  applyToEnvironment: (environment) => environment.name !== "client",
  load(id) {
    if (id !== PRETTIER_STUB_ID) return;

    return `export const format = () => {
  throw new Error("prettier is stubbed out of the Worker bundle; render emails without \`pretty\`.");
};
export default {};`;
  },
  resolveId(source) {
    if (source === "prettier/standalone" || source === "prettier/plugins/html")
      return PRETTIER_STUB_ID;
  },
});

// @react-email/tailwind imports every React Email component it knows how to
// restyle, as optional peers. Stub the ones our emails don't use, so code-block
// (with its Prism grammars) and friends stay out of the server bundles.
const UNUSED_REACT_EMAIL_COMPONENTS: Record<string, string> = {
  "@react-email/button": "Button",
  "@react-email/code-block": "CodeBlock",
  "@react-email/code-inline": "CodeInline",
  "@react-email/img": "Img",
};
const REACT_EMAIL_STUB_PREFIX = "\0react-email-stub:";
const stubUnusedReactEmailComponents = (): Plugin => ({
  enforce: "pre",
  name: "stub-unused-react-email-components",
  applyToEnvironment: (environment) => environment.name !== "client",
  load(id) {
    if (!id.startsWith(REACT_EMAIL_STUB_PREFIX)) return;

    const name =
      UNUSED_REACT_EMAIL_COMPONENTS[id.slice(REACT_EMAIL_STUB_PREFIX.length)];

    return `export const ${name} = () => {
  throw new Error("${name} is stubbed out; add its @react-email package and remove the stub in vite.config.ts to use it.");
};`;
  },
  resolveId(source) {
    if (source in UNUSED_REACT_EMAIL_COMPONENTS)
      return `${REACT_EMAIL_STUB_PREFIX}${source}`;
  },
});

// Club data ships as a static asset (served by the ASSETS binding) rather than
// inside the Worker bundle. See lib/clubs-data.ts.
const clubsDataAsset = (): Plugin => ({
  apply: "build",
  name: "clubs-data-asset",
  applyToEnvironment: (environment) => environment.name === "client",
  generateBundle() {
    this.emitFile({
      fileName: "data/clubs.json",
      source: readFileSync(require.resolve("@sudburyrc/static/clubs.json")),
      type: "asset",
    });
  },
});

export default defineConfig({
  define: {
    __MAPTILER_SDK_VERSION__: JSON.stringify(maptilerSdkVersion),
  },
  plugins: [
    stubPrettier(),
    stubUnusedReactEmailComponents(),
    clubsDataAsset(),
    contentCollections(),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkGfm,
          remarkHeading,
          remarkAdmonition,
          remarkSmartypants,
        ],
      }),
    },
    vinext({
      cache: { cdn: workersCacheCdnAdapter(), data: kvDataAdapter() },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: { childEnvironments: ["ssr"], name: "rsc" },
    }),
  ],
});
