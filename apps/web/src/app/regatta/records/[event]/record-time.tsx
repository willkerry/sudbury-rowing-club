import { LCDScreen } from "@/components/lcd-screen";
import { formatVerboseDuration, type Record } from "../transformRecords";
import {
  detectCourseLength,
  formatLocalisedCourseLength,
} from "./format-description";

export const RecordTime = ({ record }: { record: Record }) => (
  <div className="mb-12 inline-block">
    <LCDScreen time={record.time} />
    <div className="mt-1.5 text-center text-sm text-gray-800">
      {formatVerboseDuration(record.time)}
      <span className="text-gray-500">
        {" · "}
        {formatLocalisedCourseLength(detectCourseLength(record))} course
      </span>
    </div>
  </div>
);
