import { CalendarIcon, MapIcon } from "@heroicons/react/20/solid";
import Link from "@/components/stour/link";
import { ReactNode } from "react";

type Props = {
  date: ReactNode;
  location: string;
};

const DateLocation = ({ date, location }: Props) => (
  <div className="my-8 flex justify-center gap-6">
    <div className="flex items-center">
      <CalendarIcon className="mr-1.5 inline-flex h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-800">{date}</span>
    </div>
    <div className="flex items-center">
      <MapIcon className="mr-1.5 inline-flex h-4 w-4 text-gray-400" />
      <span className="disambiguate text-sm text-gray-800">
        <Link href="/contact/how-to-find-us">{location}</Link>
      </span>
    </div>
  </div>
);

export default DateLocation;
