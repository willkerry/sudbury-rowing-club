import { ShieldIcon } from "lucide-react";

const Anonymous = () => (
  <span className="flex items-center not-italic">
    <ShieldIcon
      aria-hidden
      className="mr-1 mb-0.5 h-4 w-4 fill-blue-50 text-blue-200"
    />
    <span className="font-medium text-gray-500 text-xs uppercase tracking-widest">
      Anonymous
    </span>
  </span>
);

export default Anonymous;
