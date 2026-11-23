import { RedirectType, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ q: string }>;
};

const ContactRedirect = async ({ params }: PageProps) =>
  redirect(
    `/contact?q=${encodeURIComponent((await params).q)}`,
    RedirectType.push,
  );

export default ContactRedirect;
