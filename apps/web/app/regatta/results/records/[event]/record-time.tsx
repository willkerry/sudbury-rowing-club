import { formatVerboseDuration } from "../transformRecords";

export const RecordTime = ({
  time,
}: { time: { minutes: number; seconds: number } }) => (
  <div className="mb-12 rounded-3xl border bg-gray-50 p-4">
    <div className="text-center font-medium text-gray-500 text-sm uppercase tracking-widest">
      Time
    </div>
    <div className="text-center font-semibold text-9xl text-gray-950 lining-nums tracking-wider">
      {time.minutes}
      <span className="font-medium text-gray-500"></span>
      {time.seconds.toString().padStart(2, "0")}
    </div>
    <div className="text-center text-gray-500 text-sm">
      {formatVerboseDuration(time)}
    </div>
  </div>
);
