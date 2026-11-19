export const toTotalSeconds = ({
  minutes,
  seconds,
}: {
  minutes: number;
  seconds: number;
}) => minutes * 60 + seconds;
