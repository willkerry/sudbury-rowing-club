import Link from "@/components/stour/link";
import { CalendarIcon, MapIcon } from "@heroicons/react/20/solid";
import type { ReactNode } from "react";

type Props = {
  date: ReactNode;
  location: string;
};

const ICON_CLASSES = "mr-1.5 inline-flex h-4 w-4 text-gray-400";

const DateLocation = ({ date, location }: Props) => (
  <div className="my-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
    <div className="flex items-center">
      <CalendarIcon aria-hidden className={ICON_CLASSES} />
      <span className="text-gray-800 text-sm">{date}</span>
    </div>
    <div className="flex items-center">
      <MapIcon aria-hidden className={ICON_CLASSES} />
      <Link
        href="/contact/how-to-find-us"
        className="disambiguate text-gray-800 text-sm"
      >
        {location}
      </Link>
    </div>
  </div>
);

export default DateLocation;
