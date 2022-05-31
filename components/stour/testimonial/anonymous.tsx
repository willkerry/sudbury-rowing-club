import { ShieldCheckIcon } from "@heroicons/react/solid";

const Anonymous = () => (
  <div className="flex">
    <ShieldCheckIcon className="inline-flex w-4 h-4 mr-1 text-gray-300" />
    <div className="inline-flex mt-o.5 text-xs tracking-wider text-gray-600 uppercase">
      Anonymous
    </div>
  </div>
);

export default Anonymous;
