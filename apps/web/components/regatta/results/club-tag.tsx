import { buildCloudflareImageUrl } from "@sudburyrc/images";
import { type Club, clubs } from "@sudburyrc/static";
import Link from "next/link";

import { cn } from "@/lib/utils";

const CLUB_BY_CODE = new Map<string, Club>();
for (const club of clubs) {
  CLUB_BY_CODE.set(club.code.toUpperCase(), club);
  if (club.aliasCodes) {
    for (const alias of club.aliasCodes) {
      CLUB_BY_CODE.set(alias.toUpperCase(), club);
    }
  }
}

export function findClub(code: string): Club | undefined {
  return CLUB_BY_CODE.get(code.toUpperCase());
}

export function clubHrefForCode(code: string): string {
  return `/live/club_${code.toUpperCase()}.html`;
}

type Size = "inline" | "hero";

const SIZE_DIMENSIONS: Record<Size, { width: number; height: number }> = {
  hero: { height: 66, width: 140 },
  inline: { height: 16, width: 34 },
};

const ClubTagInner = ({
  club,
  code,
  size,
  showName,
}: {
  club?: Club;
  code: string;
  size: Size;
  showName: boolean;
}) => {
  const { width, height } = SIZE_DIMENSIONS[size];

  const bladeSrc =
    size === "hero" && club?.newBladeUrl
      ? buildCloudflareImageUrl(club.newBladeUrl, {
          format: "auto",
          width: width * 2,
        })
      : null;

  return (
    <>
      {bladeSrc ? (
        <img
          alt=""
          className="h-[66px] w-[140px] shrink-0 object-contain"
          decoding="async"
          height={height}
          loading="lazy"
          src={bladeSrc}
          width={width}
        />
      ) : (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-sm font-semibold",
            !club?.colours && "bg-gray-100 text-gray-800",
            size === "inline" && "h-[18px] px-1.5 text-[10px] tracking-wide",
            size === "hero" && "h-[66px] px-4 text-sm",
          )}
          style={
            club?.colours
              ? {
                  backgroundColor: club.colours.field,
                  color: club.colours.text,
                }
              : undefined
          }
        >
          {code.toUpperCase()}
        </span>
      )}
      {showName && (
        <span
          className={cn(
            "min-w-0 truncate",
            size === "hero" && "font-semibold text-xl tracking-tight",
          )}
        >
          {club?.name ?? code}
        </span>
      )}
    </>
  );
};

export const ClubTag = ({
  code,
  size = "inline",
  showName = false,
  href,
  linked = false,
  className,
}: {
  code: string;
  size?: Size;
  showName?: boolean;
  /** Explicit link target. Overrides `linked`. */
  href?: string | null;
  /** If true, link to `/live/club_<CODE>.html` automatically. */
  linked?: boolean;
  className?: string;
}) => {
  const club = findClub(code);

  const resolvedHref = href ?? (linked ? clubHrefForCode(code) : null);
  const wrapperClassName = cn(
    "inline-flex items-center gap-1.5",
    size === "hero" && "gap-3",
    className,
  );

  if (resolvedHref) {
    return (
      <Link
        className={cn(wrapperClassName, "hover:opacity-80")}
        href={resolvedHref}
        title={club?.name ?? code}
      >
        <ClubTagInner club={club} code={code} showName={showName} size={size} />
      </Link>
    );
  }

  return (
    <span className={wrapperClassName}>
      <ClubTagInner club={club} code={code} showName={showName} size={size} />
    </span>
  );
};
