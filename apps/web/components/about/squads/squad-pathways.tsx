import { CircleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PathwayCard = Card;
const PathwayCardHeader = CardHeader;
const PathwayCardTitle = CardTitle;

const PathwayCardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <CardDescription className="flex flex-col gap-3">{children}</CardDescription>
);

const PathwayCardContent = ({ children }: { children: React.ReactNode }) => (
  <CardContent>
    <div className="flex flex-col justify-start gap-4">{children}</div>
  </CardContent>
);

const PathwayCardContentPrimary = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="font-medium text-sm">{title}</div>
    <div className="text-xs">{children}</div>
  </div>
);

const PathwayCardContentSecondary = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-row gap-3">
    <CircleIcon aria-hidden className="mt-2 h-4 w-4" />
    <div className="flex flex-col">
      <p className="font-medium text-sm">{title}</p>
      <div className="text-xs">{children}</div>
    </div>
  </div>
);

export const SquadPathways = ({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "not-prose flex flex-col items-center justify-center text-center",
      className,
    )}
    {...props}
  >
    <div className="grid w-full grid-cols-1 gap-4 text-left lg:grid-cols-3">
      {children}
    </div>
  </div>
);

Object.assign(SquadPathways, {
  PathwayCard,
  PathwayCardHeader,
  PathwayCardTitle,
  PathwayCardDescription,
  PathwayCardContent,
  PathwayCardContentPrimary,
  PathwayCardContentSecondary,
});
