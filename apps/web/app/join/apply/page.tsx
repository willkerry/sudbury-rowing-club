import type { NextPage } from "next";
import Link from "next/link";
import TextPage from "@/components/layouts/text-page";
import { Loading } from "@/components/stour/loading";
import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  description:
    "Apply for a place on Sudbury Rowing Club's Learn to Row programme.",
  image: { title: "Apply for Learn to Row 🚣" },
  title: "Apply for Learn to Row",
});

const LearnToRowApplicationForm: NextPage = () => (
  <TextPage title="Apply for Learn to Row">
    <p>
      What’s the next step? After we receive your application, the Learn to Row
      coordinator will contact you ahead of the next course to arrange a taster
      session.
    </p>
    <p className="prose-sm">
      Alternatively,{" "}
      <Link href={{ pathname: "/contact", query: { q: "l2r,captain" } }}>
        contact the Learn to Row coordinator
      </Link>{" "}
      directly.
    </p>
    <iframe
      className="overflow-hidden rounded-sm border shadow-inner"
      frameBorder={0}
      height={720}
      marginHeight={0}
      marginWidth={0}
      src="https://docs.google.com/forms/d/e/1FAIpQLScoypkKpYLlr4Tv-pdsl2N9hJs1_TCGJyv1xdkDWpZs2se6qA/viewform?embedded=true"
      title="Learn to Row application form"
      width="100%"
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
