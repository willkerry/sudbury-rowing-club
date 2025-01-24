import { useTranslations } from "next-intl";
import { Wordmark } from "@sudburyrc/blue";
import Link from "next/link";

const NavLogo = () =>  {
const t = useTranslations("../components/nav");

return (
  <Link href="/" className="flex justify-start text-blue-900 lg:w-0 lg:flex-1">
    <span className="sr-only">{t('sudbury-rowing-club')}</span>
    <Wordmark className="h-8 w-auto md:h-10" />
  </Link>
)
};

export default NavLogo;
