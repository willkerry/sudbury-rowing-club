import TextPage from "@/components/layouts/text-page";
import Loading from "@/components/stour/loading";
import Note from "@/components/stour/note";
import Link from "next/link";

export default function LearnToRowApplicationForm() {
  return (
    <TextPage title="Apply for Learn to Row" ogImage="/assets/og/apply.png">
      <Note label="Course Dates" type="success" size="small">
        Our next Learn to Row course will run on Saturday afternoons from 4 Sep
        2021 to 25 Sep 2021, (13:00 to 16:00).
      </Note>

      <p>
        What’s the next step? After we receive your application, the Learn to
        Row coordinator will contact you ahead of the next course to arrange a
        taster session.
      </p>
      <p className="prose-sm">
        Contact the Learn to Row coordinator for{" "}
        <Link href="/contact">help with this form</Link>. If you’d like to find
        out a little more about the club before applying, the{" "}
        <Link href="/contact">chairman and captain</Link> will be happy to help.
        Visit British Rowing for{" "}
        <Link href="https://www.britishrowing.org/go-rowing/learn-to-row/adults/">
          more background on Learn to Row
        </Link>
        .
      </p>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScoypkKpYLlr4Tv-pdsl2N9hJs1_TCGJyv1xdkDWpZs2se6qA/viewform?embedded=true"
        width="100%"
        height={720}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        className="overflow-hidden border shadow-inner rounded-xl"
      >
        Loading…
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
}
