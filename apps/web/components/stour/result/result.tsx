import cn from "@sudburyrc/cn";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

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
      key={0}
      className={cn([ICON_CLASSES, "text-green-400"])}
    />,
  ],
  [
    "error",
    <XCircleIcon key={1} className={cn([ICON_CLASSES, "text-red-400"])} />,
  ],
  [
    "warning",
    <ExclamationCircleIcon
      key={2}
      className={cn([ICON_CLASSES, "text-yellow-400"])}
    />,
  ],
  [
    "empty",
    <ExclamationCircleIcon
      key={3}
      className={cn([ICON_CLASSES, "text-gray-400"])}
    />,
  ],
]);

const Result = ({ title, message, variant }: ResultProps) => (
  <div className="grid grid-cols-1 items-center justify-center gap-2 text-center">
    {ICON_MAP.get(variant)}
    <h3 className="text-xl font-medium text-gray-400">{title}</h3>
    {message && <p className="text-xs font-medium text-gray-600">{message}</p>}
  </div>
);

export default Result;
