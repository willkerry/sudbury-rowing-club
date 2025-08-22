import { Loading } from "@/components/stour/loading";
import { Skeleton } from "@/components/ui/skeleton";

const LandingPageGalleryLoader = () => (
  <Skeleton className="h-[305px] w-full rounded-none">
    <Loading />
  </Skeleton>
);

export default LandingPageGalleryLoader;
