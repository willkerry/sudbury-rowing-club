import { LCDScreen } from "@/components/lcd-screen";
import { formatVerboseDuration } from "../transformRecords";

export const RecordTime = ({
  time,
}: {
  time: { minutes: number; seconds: number };
}) => (
  <div className="mb-12 inline-block">
    <LCDScreen time={time} />
    <div className="mt-1.5 text-center text-sm text-gray-800">
      {formatVerboseDuration(time)}
    </div>
  </div>
);
