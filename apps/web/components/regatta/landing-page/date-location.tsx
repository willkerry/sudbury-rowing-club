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
      <span className="text-sm text-gray-800">{date}</span>
    </div>
    <div className="flex items-center">
      <MapIcon aria-hidden className={ICON_CLASSES} />
      <Link
        href="/contact/how-to-find-us"
        className="disambiguate text-sm text-gray-800"
      >
        {location}
      </Link>
    </div>
  </div>
);

export default DateLocation;
