import { Skeleton } from "@/components/ui/skeleton";

const LandingPageIntroductionSkeleton = () => (
  <>
    <div className="prose mx-auto space-y-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>

    <div className="h-16" />

    <Skeleton className="mx-auto h-12 w-48" />
    <div className="h-4" />
    <Skeleton className="mx-auto h-6 w-80" />

    <div className="h-12" />

    <Skeleton className="mx-auto h-5 w-30" />

    <div className="h-4" />

    <div className="mx-auto flex flex-wrap justify-between gap-3">
      <Skeleton className="h-11 w-40" />
      <Skeleton className="h-11 w-40" />
      <Skeleton className="h-11 w-40" />
      <Skeleton className="h-11 w-40" />
      <Skeleton className="h-11 w-40" />
    </div>

    <div className="h-8" />
  </>
);

export default LandingPageIntroductionSkeleton;
