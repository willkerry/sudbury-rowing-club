import { ShieldCheckIcon } from "@heroicons/react/20/solid";

const Anonymous = () => (
  <div className="flex">
    <ShieldCheckIcon className="mr-1 inline-flex h-4 w-4 text-gray-300" />
    <div className="mt-0.5 inline-flex text-xs uppercase tracking-wider text-gray-600">
      Anonymous
    </div>
  </div>
);

export default Anonymous;
