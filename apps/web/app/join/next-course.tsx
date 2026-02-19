"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const HIDE_COURSE_AFTER_DATE = new Date(2024, 9, 15);

export const NextCourse = () => {
  const seasonStartDates: Record<string, Date> = {
    autumn: new Date("2023-09-15"),
    spring: new Date("2023-03-15"),
    summer: new Date("2023-06-15"),
    winter: new Date("2023-12-15"),
  };

  const expirySeason = Object.entries(seasonStartDates).find(
    ([, seasonStartDate]) =>
      HIDE_COURSE_AFTER_DATE.getTime() > seasonStartDate.getTime(),
  )?.[0];

  if (HIDE_COURSE_AFTER_DATE.getTime() < Date.now()) {
    return (
      <Alert variant="success">
        <AlertTitle>Our {expirySeason} course has finished</AlertTitle>
        <AlertDescription>
          Check back soon for details of our next course. Apply now to register
          your interest and be notified when the next course is announced.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="prose-sm rounded-sm border border-green-200 bg-green-50 px-2 pb-1 prose-a:underline">
      <h3 className="mt-2 mb-1 flex items-center gap-1 font-semibold text-base">
        Course Dates
        <span className="mt-0.5 rounded-full bg-green-500 px-1 py-0.5 font-semibold text-white text-xs uppercase tracking-wider">
          New
        </span>
      </h3>
      <p>
        The next and final L2R course for 2024 is to take place over the last
        two Saturdays in August and first two Saturdays in September.
      </p>

      <p>
        I am holding taster sessions between 11:30 and 13:00 on Saturday 29 June
        and 6 July.
      </p>

      <p>
        Please <Link href="join/apply">register your interest</Link> if you
        would like to take part in the Learn to Row course.
      </p>
    </div>
  );
};
