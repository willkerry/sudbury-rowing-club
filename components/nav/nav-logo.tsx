import Link from "next/link";
import Logo from "@/components/logo";

const NavLogo = () => (
  <div className="flex justify-start text-blue-800 lg:w-0 lg:flex-1">
    <Link href="/">
      <a>
        <span className="sr-only">Sudbury Rowing Club</span>
        <Logo className="w-auto h-8 sm:h-10" />
      </a>
    </Link>
  </div>
);

export default NavLogo;
