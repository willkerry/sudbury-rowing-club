import type * as MaptilerSdk from "@maptiler/sdk";

declare global {
  const __MAPTILER_SDK_VERSION__: string;

  interface Window {
    maptilersdk?: typeof MaptilerSdk;
  }
}

// Loaded from MapTiler's CDN in the browser so the SDK (and the MapLibre build
// it bundles) stays out of the Worker bundle. The version comes from the
// `@maptiler/sdk` devDependency, which otherwise only supplies types.
const CDN_BASE = `https://cdn.maptiler.com/maptiler-sdk-js/v${__MAPTILER_SDK_VERSION__}`;

let sdkPromise: Promise<typeof MaptilerSdk> | undefined;

const loadStylesheet = () => {
  const href = `${CDN_BASE}/maptiler-sdk.css`;

  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);
};

export const loadMaptilerSdk = (): Promise<typeof MaptilerSdk> => {
  sdkPromise ??= new Promise((resolve, reject) => {
    loadStylesheet();

    if (window.maptilersdk) {
      resolve(window.maptilersdk);

      return;
    }

    const script = document.createElement("script");
    script.src = `${CDN_BASE}/maptiler-sdk.umd.min.js`;
    script.async = true;
    script.onload = () =>
      window.maptilersdk
        ? resolve(window.maptilersdk)
        : reject(new Error("MapTiler SDK did not load"));
    script.onerror = () => {
      sdkPromise = undefined;
      reject(new Error("Could not load the MapTiler SDK"));
    };
    document.head.append(script);
  });

  return sdkPromise;
};
