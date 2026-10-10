import { Dialog } from "@base-ui/react/dialog";
import { MenuIcon } from "lucide-react";

export const MobileMenuButton = () => (
  <div className="-my-2 -mr-2 sm:hidden">
    <Dialog.Trigger className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500">
      <span className="sr-only">Open menu</span>
      <MenuIcon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
    </Dialog.Trigger>
  </div>
);
