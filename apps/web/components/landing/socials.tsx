import cn from "clsx";
import { SOCIALS, SUPPORTED_SOCIALS } from "@/lib/constants";
import Facebook from "@/components/icons/socials/facebook";
import Instagram from "@/components/icons/socials/instagram";

type AvailableSocials = (typeof SUPPORTED_SOCIALS)[number];

const ICONS: Record<
  AvailableSocials,
  React.ComponentType<{ className: string }>
> = {
  facebook: Facebook,
  instagram: Instagram,
};

const COLORS: Record<AvailableSocials, string> = {
  facebook: "text-blue-600",
  instagram: "text-pink-500",
};

const Socials = () => (
  <div className="my-8 flex flex-col items-center justify-center gap-8 md:flex-row">
    {Object.entries(SOCIALS).map(([key, { handle, href, name }]) => {
      const Icon = ICONS[key as AvailableSocials];

      return (
        <a
          key={name}
          href={href}
          className="group flex items-center gap-2"
          aria-label={name}
        >
          <Icon
            className={cn(
              "h-8 w-8 transition group-hover:-translate-y-1 group-hover:rotate-12 group-hover:scale-110 group-hover:drop-shadow-lg",
              COLORS[key as AvailableSocials]
            )}
            aria-hidden
          />

          <span className="mb-0.5 text-lg font-medium text-gray-600 transition-colors group-hover:text-gray-900">
            {handle}
          </span>
        </a>
      );
    })}
  </div>
);

export default Socials;
