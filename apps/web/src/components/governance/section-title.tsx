import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SectionTitle = ({ className, children }: Props) => (
  <h2
    className={cn(
      "mt-8 mb-6 text-2xl font-bold tracking-tight text-gray-800 sm:mt-16",
      className,
    )}
  >
    {children}
  </h2>
);
