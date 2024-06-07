"use client";

import Link from "next/link";
import Note from "@/components/stour/note";

const HIDE_COURSE_AFTER_DATE = new Date(2024, 4, 28);

export const NextCourse = () => {
  const seasonStartDates: Record<string, Date> = {
    spring: new Date("2023-03-15"),
    summer: new Date("2023-06-15"),
    autumn: new Date("2023-09-15"),
    winter: new Date("2023-12-15"),
  };

  const expirySeason = Object.entries(seasonStartDates).find(
    ([, seasonStartDate]) =>
      HIDE_COURSE_AFTER_DATE.getTime() > seasonStartDate.getTime(),
  )?.[0];

  if (HIDE_COURSE_AFTER_DATE.getTime() < Date.now()) {
    return (
      <Note
        className="m-4 bg-white"
        type="success"
        label={`Our ${expirySeason} course has finished`}
      >
        Check back soon for details of our next course. Apply now to register
        your interest and be notified when the next course is announced.
      </Note>
    );
  }

  return (
    <div className="prose-sm rounded border border-green-200 bg-green-50 px-2 pb-1">
      <h3 className="mb-1 mt-2 flex items-center gap-1 text-base font-semibold">
        Course Dates
        <span className="mt-0.5 rounded-full bg-green-500 px-1 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          New
        </span>
      </h3>
      <p>
        Please <Link href="join/apply">register your interest</Link> for the
        Learn to Row course dates for 2024.
      </p>
      <p>
        First <strong>taster sessions</strong> being held:
        <div>3 February 2024, 11:30-13:00</div>
        <div>10 February 2024, 11:30-13:00</div>
      </p>
      <p className="mb-0">Followed by two separate courses:</p>
      <div className="grid gap-4 py-0 md:grid-cols-2">
        <div>
          <strong>Course 1 (Saturday 13:00-16:00)</strong>
          <div>2 March 2023</div>
          <div>9 March 2023</div>
          <div>16 March 2023</div>
          <div>23 March 2023</div>
        </div>

        <div>
          <strong>Course 2 (Saturday 13:00-16:00)</strong>
          <div>6 April 2023</div>
          <div>13 April 2023</div>
          <div>20 April 2023</div>
          <div>27 April 2023</div>
        </div>
      </div>
      <p>
        <Link href="join/apply">Register your interest</Link> now or{" "}
        <Link href="/contact?q=learntorow">contact Sean Moriarty</Link> for
        further information.
      </p>

      <p>We look forward to welcoming you to the club.</p>
    </div>
  );
};
