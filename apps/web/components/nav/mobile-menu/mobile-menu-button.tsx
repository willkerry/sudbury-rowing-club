import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/24/outline";

const MobileMenuButton = () => (
  <div className="-my-2 -mr-2 sm:hidden">
    <Button
      variant="ghost"
      size="icon"
      className="inline-flex items-center justify-center rounded-md p-2 text-gray-40 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-inset"
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="h-6 w-6" aria-hidden />
    </Button>
  </div>
);

export default MobileMenuButton;
