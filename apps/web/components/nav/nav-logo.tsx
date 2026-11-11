import { Wordmark } from "@sudburyrc/blue";
import Link from "next/link";

export const NavLogo = () => (
  <Link className="flex justify-start text-blue-900 lg:w-0 lg:flex-1" href="/">
    <span className="sr-only">Sudbury Rowing Club</span>
    <Wordmark className="h-8 w-auto md:h-10" />
  </Link>
);
