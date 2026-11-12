import { DurableObject } from "cloudflare:workers";
import puppeteer, { type Browser } from "@cloudflare/puppeteer";

const NAVIGATION_TIMEOUT_MS = 15_000;
const FAILURE_COOLDOWN_MS = 60_000;

// Runs in the page. Replaces the body with the contents of the page's
// <template data-og-template> and returns the size to screenshot at.
const EXTRACT_TEMPLATE = `(() => {
  const template = document.querySelector("template[data-og-template]");
  if (!template) return null;

  const width = Number.parseInt(template.dataset.ogWidth || "1200", 10);
  const height = Number.parseInt(template.dataset.ogHeight || "630", 10);

  document.body.replaceChildren(template.content.cloneNode(true));
  document.body.style.cssText =
    "margin:0;padding:0;overflow:hidden;width:" + width + "px;height:" + height + "px;";
  void document.body.offsetHeight;

  return { width, height };
})()`;

type Dimensions = { width: number; height: number };

/**
 * A singleton that owns the headless browser. It reuses one browser for
 * overlapping requests, shares a single render between concurrent requests
 * for the same image, and closes the browser as soon as nothing is in
 * flight: on the Workers Free plan every second the browser stays open counts
 * against the 10 minutes a day of Browser Rendering.
 */
export class OgRenderer extends DurableObject<Env> {
  private browser?: Promise<Browser>;
  private inflight = new Map<string, Promise<Uint8Array>>();
  private failures = new Map<string, number>();

  render(url: string): Promise<Uint8Array> {
    const failedAt = this.failures.get(url);

    if (failedAt && Date.now() - failedAt < FAILURE_COOLDOWN_MS) {
      return Promise.reject(
        new Error(`Skipping ${url}: it failed less than a minute ago`),
      );
    }

    const existing = this.inflight.get(url);
    if (existing) return existing;

    const job = this.screenshot(url)
      .then((png) => {
        this.failures.delete(url);

        return png;
      })
      .catch((error: unknown) => {
        this.failures.set(url, Date.now());
        throw error;
      })
      .finally(() => {
        this.inflight.delete(url);
        if (this.inflight.size === 0) this.closeBrowser();
      });

    this.inflight.set(url, job);

    return job;
  }

  private async screenshot(url: string): Promise<Uint8Array> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // Server-rendered HTML and CSS are all the template needs. Without
      // JavaScript, React doesn't hydrate over the swapped-in body and
      // analytics don't count the visit.
      await page.setJavaScriptEnabled(false);

      const response = await page.goto(url, {
        timeout: NAVIGATION_TIMEOUT_MS,
        waitUntil: "load",
      });

      if (!response?.ok()) {
        throw new Error(`${url} responded with ${response?.status()}`);
      }

      const dimensions = (await page.evaluate(
        EXTRACT_TEMPLATE,
      )) as Dimensions | null;

      if (!dimensions) throw new Error(`No OG template found on ${url}`);

      await page.setViewport({ ...dimensions, deviceScaleFactor: 1 });
      await page.evaluate("document.fonts.ready.then(() => true)");

      return await page.screenshot({ type: "png" });
    } finally {
      await page.close();
    }
  }

  private async getBrowser(): Promise<Browser> {
    this.browser ??= puppeteer.launch(this.env.BROWSER).catch((error) => {
      this.browser = undefined;
      throw error;
    });

    const browser = await this.browser;
    if (browser.isConnected()) return browser;

    this.browser = undefined;

    return this.getBrowser();
  }

  private closeBrowser() {
    const browser = this.browser;
    this.browser = undefined;

    browser
      ?.then((instance) => instance.close())
      .catch((error) => console.error("Failed to close browser", error));
  }
}
