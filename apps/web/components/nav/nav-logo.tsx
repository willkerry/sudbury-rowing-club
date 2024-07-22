import Link from "next/link";
import { Wordmark } from "@sudburyrc/blue";

const NavLogo = () => (
  <Link href="/" className="flex justify-start text-blue-800 lg:w-0 lg:flex-1">
    <span className="sr-only">Sudbury Rowing Club</span>
    <Wordmark className="h-8 w-auto md:h-10" />
  </Link>
);

export default NavLogo;
