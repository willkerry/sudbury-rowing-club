import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import cn from "clsx";

const Variants = ["success", "error", "warning", "empty"] as const;

type ResultProps = {
  title: string;
  message?: string;
  variant: (typeof Variants)[number];
};

const ICON_CLASSES = "h-12 w-12 mx-auto";

const ICON_MAP = new Map<(typeof Variants)[number], React.ReactNode>([
  [
    "success",
    <CheckCircleIcon
      aria-hidden
      key={0}
      className={cn([ICON_CLASSES, "text-green-400"])}
    />,
  ],
  [
    "error",
    <XCircleIcon
      aria-hidden
      key={1}
      className={cn([ICON_CLASSES, "text-red-400"])}
    />,
  ],
  [
    "warning",
    <ExclamationCircleIcon
      aria-hidden
      key={2}
      className={cn([ICON_CLASSES, "text-yellow-400"])}
    />,
  ],
  [
    "empty",
    <ExclamationCircleIcon
      aria-hidden
      key={3}
      className={cn([ICON_CLASSES, "text-gray-400"])}
    />,
  ],
]);

const Result = ({ title, message, variant }: ResultProps) => (
  <div className="grid grid-cols-1 items-center justify-center gap-2 text-center">
    {ICON_MAP.get(variant)}
    <h3 className="font-medium text-gray-400 text-xl">{title}</h3>
    {message && <p className="font-medium text-gray-600 text-xs">{message}</p>}
  </div>
);

export default Result;
