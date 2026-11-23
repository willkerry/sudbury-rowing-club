import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const NextCourse = () => (
  <Alert variant="success">
    <AlertTitle>Interested in learning to row?</AlertTitle>
    <AlertDescription>
      Register your interest and we'll let you know when our next Learn to Row
      course is announced.{" "}
      <Link className="underline" href="join/apply">
        Apply now
      </Link>
      .
    </AlertDescription>
  </Alert>
);
