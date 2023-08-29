import Link from "next/link";
import TextPage from "@/components/layouts/text-page";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import Loading from "@/components/stour/loading";
import { NextPage } from "next";

const LearnToRowApplicationForm: NextPage = () => (
  <TextPage title="Apply for Learn to Row">
    <p>
      What’s the next step? After we receive your application, the Learn to Row
      coordinator will contact you ahead of the next course to arrange a taster
      session.
    </p>
    <p className="prose-sm">
      Alternatively, contact the Learn to Row coordinator directly at{" "}
      <Obfuscate email="l2r@sudburyrowingclub.org.uk" />.
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
    <p className="prose-sm">
      Trouble accessing the Google Form?{" "}
      <Link href="https://docs.google.com/forms/d/e/1FAIpQLScoypkKpYLlr4Tv-pdsl2N9hJs1_TCGJyv1xdkDWpZs2se6qA/viewform">
        View it full-page
      </Link>
      .
    </p>
  </TextPage>
);

export default LearnToRowApplicationForm;
