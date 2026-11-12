import { IconShield } from "@tabler/icons-react";

export const Anonymous = () => (
  <span className="flex items-center not-italic">
    <IconShield
      aria-hidden
      className="mr-1 mb-0.5 h-4 w-4 fill-blue-50 text-blue-200"
    />
    <span className="uppercase text-xs font-medium tracking-widest text-gray-500">
      Anonymous
    </span>
  </span>
);
