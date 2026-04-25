import { CheckCircleIcon, ClockIcon } from "lucide-react";
import { Container } from "../../layouts/container";

const STATE_LABELS = {
  active: "Live",
  complete: "Results",
  draw: "Draw",
};

export const LiveHeader = ({
  title,
  state = "active",
}: {
  title: string;
  label?: string;
  state?: "draw" | "active" | "complete";
}) => (
  <div className="border-y bg-white">
    <Container aria-hidden className="flex items-center gap-3 py-2.5">
      {state === "active" && (
        <>
          <span aria-hidden className="relative inline-flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
          </span>
          <span className="font-semibold text-red-700 text-xs uppercase tracking-wider">
            {STATE_LABELS.active}
          </span>
        </>
      )}

      {state === "draw" && (
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-black" />
          <span className="font-semibold text-black text-sm">
            {STATE_LABELS.draw}
          </span>
        </div>
      )}

      {state === "complete" && (
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-4 w-4 text-green-700" />
          <span className="font-semibold text-green-700 text-sm">
            {STATE_LABELS.complete}
          </span>
        </div>
      )}

      <span className="truncate text-gray-600 text-sm">{title}</span>
    </Container>

    {/* visually hidden H1 for screen readers */}
    <h1 className="sr-only">
      {STATE_LABELS[state]} for {title}
    </h1>
  </div>
);
