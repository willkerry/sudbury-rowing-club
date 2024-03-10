import { ShieldIcon } from "lucide-react";

const Anonymous = () => (
  <span className="flex items-center not-italic">
    <ShieldIcon
      aria-hidden
      className="mb-0.5 mr-1 h-4 w-4 fill-blue-50 text-blue-200"
    />
    <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
      Anonymous
    </span>
  </span>
);

export default Anonymous;
