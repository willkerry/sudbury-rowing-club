import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const L2RCallToActionText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={cn("font-medium opacity-90", className)}>{children}</span>
);

const L2RCallToActionSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-between gap-4 rounded-sm border p-6",
      className,
    )}
  >
    {children}
  </div>
);

export const L2RCallToAction = () => (
  <div className="my-20 grid gap-6 text-gray-700 sm:my-36 sm:gap-12 md:grid-cols-2">
    <L2RCallToActionSection className="border-green-200 bg-green-50">
      <L2RCallToActionText>Send your application form now</L2RCallToActionText>
      <Button asChild variant="success">
        <Link href="/join/apply">Apply</Link>
      </Button>
    </L2RCallToActionSection>
    <L2RCallToActionSection className="bg-gray-50">
      <L2RCallToActionText>
        Contact the Learn to Row coordinator
      </L2RCallToActionText>
      <Button asChild>
        <Link href="./contact?q=l2r,captain">Contact</Link>
      </Button>
    </L2RCallToActionSection>
  </div>
);
