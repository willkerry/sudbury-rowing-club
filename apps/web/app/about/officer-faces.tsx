"use client";

import type { OfficerResponse } from "@sudburyrc/api";
import Image from "next/image";
import NextLink from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Face = OfficerResponse & {
  avatar: NonNullable<OfficerResponse["avatar"]>;
};

/** A row of the other officers who have photos, each linking to their contact form. */
export const OfficerFaces = ({ officers }: { officers: Face[] }) => (
  <TooltipProvider delay={0}>
    <ul className="flex flex-wrap gap-2">
      {officers.map(({ _id, avatar, name, role }) => (
        <li key={_id}>
          <Tooltip>
            <TooltipTrigger
              aria-label={`Contact ${name}, ${role}`}
              className="relative block size-10 overflow-hidden rounded-full outline outline-white/10 -outline-offset-1 transition-[outline-color] duration-150 hover:outline-2 hover:outline-blue-300 hover:outline-offset-1 focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-1"
              render={
                <NextLink href={{ pathname: "/contact", query: { to: _id } }} />
              }
            >
              <Image
                alt=""
                blurDataURL={avatar.lqip}
                className="object-cover"
                fill
                placeholder="blur"
                sizes="40px"
                src={avatar.url}
              />
            </TooltipTrigger>
            <TooltipContent>
              <span className="font-semibold">{name}</span>
              <span className="text-gray-600">, {role}</span>
            </TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  </TooltipProvider>
);
