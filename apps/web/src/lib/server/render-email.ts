/// <reference types="@vitejs/plugin-rsc/types" />
import type * as EmailRenderer from "../../emails/render";
import type {
  EmailTemplateName,
  EmailTemplateProps,
} from "../../emails/render";

/**
 * Renders an email template to HTML. vinext runs route handlers in the RSC
 * environment, which has no react-dom/server, so the templates render in the
 * SSR environment instead. Tests mock this module.
 */
export const renderEmail = async <Name extends EmailTemplateName>(
  name: Name,
  props: EmailTemplateProps<Name>,
): Promise<string> => {
  const renderer = await import.meta.viteRsc.import<typeof EmailRenderer>(
    "../../emails/render",
    { environment: "ssr" },
  );

  return renderer.renderEmail(name, props);
};
