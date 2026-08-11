import { Blade } from "@/components/stour/blade";
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

const resolveTestimonialAttributionType = (
  testimonial: TestimonialType,
): "NAME_AND_CLUB" | "NAME_ONLY" | "CLUB_ONLY" | "ANONYMOUS" => {
  if (testimonial.name && testimonial.club) {
    return "NAME_AND_CLUB";
  }

  if (testimonial.clubName) {
    return "CLUB_ONLY";
  }

  if (testimonial.name) {
    return "NAME_ONLY";
  }

  return "ANONYMOUS";
};

const WithBlade = ({
  testimonial,
  className,
  as: Component = "div",
}: { testimonial: TestimonialType } & React.ComponentProps<"div"> & {
    as?: "div" | "span";
  }) => {
  const words = testimonial.clubName?.split(" ");

  return (
    <Component className={className}>
      {words?.map((word, index) => {
        const isLastWord = index === words.length - 1;

        return (
          <span className="last:inline-block" key={index}>
            {word}{" "}
            {isLastWord && testimonial.clubBladeUrl && (
              <Blade
                alt={`${testimonial.clubName} blade`}
                className="-mb-0.5 ml-0.5 inline-block h-4 w-8"
                height={16}
                src={testimonial.clubBladeUrl}
                width={32}
              />
            )}
          </span>
        );
      })}
    </Component>
  );
};

const Attribution = ({ testimonial }: { testimonial: TestimonialType }) => {
  switch (resolveTestimonialAttributionType(testimonial)) {
    case "ANONYMOUS":
      return <Anonymous />;

    case "NAME_AND_CLUB":
      return (
        <cite className="text-gray-800">
          {testimonial.name}

          <WithBlade
            className="text-gray-500 text-sm"
            testimonial={testimonial}
          />
        </cite>
      );

    case "NAME_ONLY":
      return <cite className="text-gray-800">{testimonial.name}</cite>;

    case "CLUB_ONLY":
      return <WithBlade className="text-gray-800" testimonial={testimonial} />;
  }
};

export const Testimonial = ({ ...testimonial }: TestimonialType) => (
  <figure className="mb-4 inline-block w-full break-inside-avoid rounded-lg border p-4 sm:mb-10">
    <blockquote
      className={cn(
        "space-y-4 leading-snug",
        {
          "hyphens-auto text-gray-800 text-sm": testimonial.text?.length > 250,
        },
        { "font-light text-black text-lg": testimonial.text?.length < 250 },
      )}
    >
      {testimonial.text}
    </blockquote>

    <figcaption className="pt-3 font-medium leading-snug">
      <Attribution testimonial={testimonial} />
    </figcaption>
  </figure>
);
