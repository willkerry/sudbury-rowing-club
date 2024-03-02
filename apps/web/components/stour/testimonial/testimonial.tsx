import { type Testimonial as TestimonialType } from "@sudburyrc/api";
import { cn } from "@/lib/utils";
import Anonymous from "./anonymous";

const Testimonial = ({ name, club, text }: TestimonialType) => (
  <figure className="mb-4 sm:mb-10 inline-block break-inside-avoid rounded-lg border p-4 w-full">
    <blockquote
      className={cn(
        "space-y-4 leading-snug",
        { "hyphens-auto text-sm text-gray-800": text?.length > 250 },
        { "text-lg font-light text-black": text?.length < 250 },
      )}
    >
      {text}
    </blockquote>
    <figcaption className="pt-3 font-medium leading-snug">
      <cite className="text-gray-800">{name || <Anonymous />}</cite>
      {club && <div className="text-sm text-gray-500">{club}</div>}
    </figcaption>
  </figure>
);

export default Testimonial;
