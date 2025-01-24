import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Link from "../stour/link";
import { Button } from "../ui/button";
import { HundredAndFiftyFireworks } from "./150-fireworks";
import { HundredAndFiftyGradient } from "./150-gradient";
import { HundredAndFiftyLogo } from "./150-logo";

export const HundredAndFiftyCta = () =>  {
const t = useTranslations("../components/anniversary");

return (
  <div className="relative isolate grid grid-cols-1 items-center overflow-hidden rounded-lg border bg-gray-900 text-white shadow md:grid-cols-3">
    <div className="mt-12 flex h-full items-center justify-center md:relative md:my-12">
      <HundredAndFiftyLogo block={false} />
      <HundredAndFiftyFireworks />
    </div>

    <HundredAndFiftyGradient />

    <div className="col-span-2 px-8 py-16">
      <p className="mb-1 font-medium text-lg text-sky-200">{t('anniversary-150th')}</p>
      <h2 className="mb-6 font-bold text-3xl">{t('celebrating-150-years')}</h2>
      <p className="mb-10 opacity-70">{t('celebration-invitation')}</p>
      <Button asChild variant="secondary">
        <Link href="/150">{t('visit-mini-site')}</Link>
      </Button>

      <Button
        asChild
        variant="link"
        className="text-white hover:text-white"
        icon={<ArrowRight />}
      >
        <Link href="/150/gallery">{t('view-gallery')}</Link>
      </Button>
    </div>
  </div>
)
};
