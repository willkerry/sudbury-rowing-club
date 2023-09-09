import cn from "clsx";
import { type Testimonial as TestimonialType } from "@sudburyrc/api";
import Anonymous from "./anonymous";

const Testimonial = ({ name, club, text }: TestimonialType) => (
  <figure className="mb-10 inline-block break-inside-avoid rounded-lg border p-6">
    <blockquote
      className={cn(
        "space-y-4 leading-snug",
        { "hyphens-auto text-sm text-gray-800": text?.length > 250 },
        { "text-lg font-light text-black": text?.length < 250 }
      )}
    >
      {text}
    </blockquote>
    <figcaption className="pt-5 font-medium leading-snug">
      <div className="text-gray-800">{name || <Anonymous />}</div>
      {club && <div className="text-sm text-gray-500">{club}</div>}
    </figcaption>
  </figure>
);

export default Testimonial;
