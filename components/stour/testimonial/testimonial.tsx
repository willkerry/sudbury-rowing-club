import cn from "classnames";
import Anonymous from "./anonymous";
import { type Testimonial } from "@/lib/queries/fetch-regattas";

const Testimonial = ({ name, club, text }: Testimonial) => (
  <figure className="inline-block border rounded-lg mb-10 p-6 break-inside-avoid">
    <blockquote
      className={cn(
        "space-y-4 leading-snug",
        { "text-sm text-gray-800 hyphens-auto": text?.length > 250 },
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
