import { cn } from "@/lib/utils";

export const Iframe = ({
  aspectRatio,
  className,
  title = "Embedded content",
  ...props
}: React.HTMLAttributes<HTMLIFrameElement> & {
  src?: string;
  aspectRatio?: number;
}) => (
  <div
    className="relative h-0 w-full overflow-hidden rounded-sm pt-[25px]"
    style={{
      paddingBottom: `${(aspectRatio || 0.5625) * 100}%`,
    }}
  >
    <iframe
      className={cn("absolute inset-0 h-full w-full", className)}
      width="100%"
      allowFullScreen
      title={title}
      {...props}
    />
  </div>
);
