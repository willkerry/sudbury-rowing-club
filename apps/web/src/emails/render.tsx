import { render } from "@react-email/render";
import { ContactFormEmail } from "./contact-form";
import { ContactFormDeliveredEmail } from "./contact-form-delivered";
import { ContactFormFailedEmail } from "./contact-form-failed";

// Runs in the SSR environment: react-dom/server, which render() needs, is not
// available in the RSC environment where route handlers run. Load it through
// lib/server/render-email.ts.
const templates = {
  contactForm: ContactFormEmail,
  contactFormDelivered: ContactFormDeliveredEmail,
  contactFormFailed: ContactFormFailedEmail,
};

export type EmailTemplateName = keyof typeof templates;

export type EmailTemplateProps<Name extends EmailTemplateName> = Parameters<
  (typeof templates)[Name]
>[0];

export const renderEmail = <Name extends EmailTemplateName>(
  name: Name,
  props: EmailTemplateProps<Name>,
): Promise<string> => {
  const Template = templates[name] as (
    props: EmailTemplateProps<Name>,
  ) => React.ReactElement;

  return render(<Template {...props} />);
};
