import { CalendarIcon, MapIcon } from "@heroicons/react/20/solid";
import Link from "@/components/stour/link";
import { ReactNode } from "react";

type Props = {
  date: ReactNode;
  location: string;
};

const DateLocation = ({ date, location }: Props) => (
  <div className="flex justify-center gap-6 my-8">
    <div className="flex items-center">
      <CalendarIcon className="inline-flex w-4 h-4 mr-1.5 text-gray-400" />
      <span className="text-sm text-gray-800">{date}</span>
    </div>
    <div className="flex items-center">
      <MapIcon className="inline-flex w-4 h-4 mr-1.5 text-gray-400" />
      <span className="text-sm text-gray-800 disambiguate">
        <Link href="/contact/how-to-find-us">{location}</Link>
      </span>
    </div>
  </div>
);

export default DateLocation;
