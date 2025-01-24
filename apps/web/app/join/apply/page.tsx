import { useTranslations } from "next-intl";
import TextPage from "@/components/layouts/text-page";
import Loading from "@/components/stour/loading";
import type { NextPage } from "next";
import Link from "next/link";

const LearnToRowApplicationForm: NextPage = () =>  {
const t = useTranslations("join/apply");

return (
  <TextPage title="Apply for Learn to Row">
    <p>{t('next-step-application-process')}</p>
    <p className="prose-sm">{t('contact-learn-to-row-coordinator', { "component0": <Link href={{ pathname: "/contact", query: { q: "l2r,captain" } }}>{t('contact-learn-to-row-coordinator_component0')}</Link> })}
      </p>
    <iframe
      title="Learn to Row application form"
      src="https://docs.google.com/forms/d/e/1FAIpQLScoypkKpYLlr4Tv-pdsl2N9hJs1_TCGJyv1xdkDWpZs2se6qA/viewform?embedded=true"
      width="100%"
      height={720}
      frameBorder={0}
      marginHeight={0}
      marginWidth={0}
      className="overflow-hidden rounded border shadow-inner"
    >
      <Loading />
    </iframe>
    <p className="prose-sm">{t('access-google-form', { "component0": <Link href="https://docs.google.com/forms/d/e/1FAIpQLScoypkKpYLlr4Tv-pdsl2N9hJs1_TCGJyv1xdkDWpZs2se6qA/viewform">{t('access-google-form_component0')}</Link> })}
      </p>
  </TextPage>
)
};

export default LearnToRowApplicationForm;
