import type { OfficerResponse } from "@sudburyrc/api";
import { IconMessageCircle } from "@tabler/icons-react";
import Image from "next/image";
import NextLink from "next/link";
import { monogramName } from "@/lib/helpers/initialiseName";
import { cn } from "@/lib/utils";

type CardProps = OfficerResponse & { dark?: boolean };

const OfficerCard = ({ _id, name, role, avatar, dark }: CardProps) => (
  <NextLink
    className={cn(
      "group flex h-full flex-col items-start gap-3 rounded-sm border p-4 transition-colors duration-150",
      dark ? "border-white/15 hover:border-blue-300" : "hover:border-blue-500",
    )}
    href={{ pathname: "/contact", query: { to: _id } }}
  >
    <div
      className={cn(
        "relative flex size-14 items-center justify-center overflow-hidden rounded-full font-semibold outline -outline-offset-1",
        dark && !avatar
          ? "bg-white/10 text-gray-400 outline-white/10"
          : "bg-blue-50 text-blue-950 outline-black/10",
      )}
    >
      {avatar ? (
        <Image
          alt=""
          blurDataURL={avatar.lqip}
          className="object-cover"
          fill
          placeholder="blur"
          sizes="56px"
          src={avatar.url}
        />
      ) : (
        <span aria-hidden>{monogramName(name)}</span>
      )}
    </div>
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 font-semibold transition-colors duration-150",
          dark ? "group-hover:text-blue-300" : "group-hover:text-blue-500",
        )}
      >
        {name}
        <IconMessageCircle
          aria-hidden
          className={cn(
            "size-4 transition-colors duration-150",
            dark
              ? "text-gray-500 group-hover:text-blue-300"
              : "text-gray-400 group-hover:text-blue-500",
          )}
        />
      </div>
      <p className={cn("text-sm", dark ? "text-gray-400" : "text-gray-600")}>
        {role}
      </p>
      <span className="sr-only">Contact {name}</span>
    </div>
  </NextLink>
);

export const Officers = ({
  officers,
  dark = false,
}: {
  officers: OfficerResponse[];
  dark?: boolean;
}) => (
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {officers.map((officer) => (
      <li key={officer._id}>
        <OfficerCard dark={dark} {...officer} />
      </li>
    ))}
  </ul>
);
