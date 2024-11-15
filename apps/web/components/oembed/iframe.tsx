import { cn } from "@/lib/utils";

export const Iframe = ({
  aspectRatio,
  className,
  ...props
}: React.HTMLAttributes<HTMLIFrameElement> & {
  src?: string;
  aspectRatio?: number;
}) => (
  <div
    className="relative pt-[25px] w-full h-0 rounded overflow-hidden"
    style={{
      paddingBottom: `${(aspectRatio || 0.5625) * 100}%`,
    }}
  >
    <iframe
      className={cn("absolute inset-0 w-full h-full", className)}
      width="100%"
      allowFullScreen
      {...props}
    />
  </div>
);
