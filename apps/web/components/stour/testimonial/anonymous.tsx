import { ShieldIcon } from "lucide-react";

const Anonymous = () => (
  <span className="flex items-center not-italic">
    <ShieldIcon
      aria-hidden
      className="mr-1 mb-0.5 h-4 w-4 text-blue-200 fill-blue-50"
    />
    <span className="text-xs uppercase tracking-widest font-medium text-gray-500">
      Anonymous
    </span>
  </span>
);

export default Anonymous;
