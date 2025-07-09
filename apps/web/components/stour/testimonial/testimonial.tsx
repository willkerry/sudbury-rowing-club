import Image from "next/image";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";
import { cn } from "@/lib/utils";
import { Anonymous } from "./anonymous";

export type TestimonialType = {
  _key: string;
  name: string;
  club?: string;
  text: string;
  clubBladeUrl?: string;
  clubHref?: string;
  clubName?: string;
};

const ClubImage = ({
  clubBladeUrl,
  clubHref,
  clubName,
}: Pick<TestimonialType, "clubBladeUrl" | "clubHref" | "clubName">) => {
  if (!clubBladeUrl) return null;

  const alt = clubName ? `${clubName} blade` : "Club blade";

  return (
    <a href={clubHref} target="_blank" rel="noopener noreferrer">
      <Image
        src={clubBladeUrl}
        loader={cloudflareLoader}
        width={32}
        height={16}
        alt={alt}
        className="mb-0.5 ml-2 inline-block h-4 w-8"
      />
    </a>
  );
};

export const Testimonial = ({
  name,
  club,
  text,
  clubBladeUrl,
  clubHref,
  clubName,
}: TestimonialType) => (
  <figure className="mb-4 inline-block w-full break-inside-avoid rounded-lg border p-4 sm:mb-10">
    <blockquote
      className={cn(
        "space-y-4 leading-snug",
        { "hyphens-auto text-gray-800 text-sm": text?.length > 250 },
        { "font-light text-black text-lg": text?.length < 250 },
      )}
    >
      {text}
    </blockquote>
    <figcaption className="pt-3 font-medium leading-snug">
      <cite className="text-gray-800">
        {name || <Anonymous />}
        {!club && (
          <ClubImage
            clubBladeUrl={clubBladeUrl}
            clubHref={clubHref}
            clubName={clubName}
          />
        )}
      </cite>
      {club && (
        <div className="text-gray-500 text-sm">
          {club}
          <ClubImage
            clubBladeUrl={clubBladeUrl}
            clubHref={clubHref}
            clubName={clubName}
          />
        </div>
      )}
    </figcaption>
  </figure>
);
