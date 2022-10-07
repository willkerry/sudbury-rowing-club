import Link from "next/link";
import Logo from "@/components/logo";

const NavLogo = () => (
  <Link href="/">
    <a className="flex justify-start text-blue-800 lg:w-0 lg:flex-1">
      <span className="sr-only">Sudbury Rowing Club</span>
      <Logo className="w-auto h-8 md:h-10" />
    </a>
  </Link>
);

export default NavLogo;
