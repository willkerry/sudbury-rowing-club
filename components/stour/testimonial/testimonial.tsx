import cn from "classnames";
import Anonymous from "./anonymous";

type Props = {
  name?: string;
  organisation?: string;
  text: string;
};

const Testimonial = ({ name, organisation, text }: Props) => (
  <figure>
    <style jsx>{`
      figure {
        display: inline-block;
        padding: 1.5em;
        margin-bottom: 2.5em;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.75rem;
        break-inside: avoid;
      }
    `}</style>
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
      {organisation && (
        <div className="text-sm text-gray-500">{organisation}</div>
      )}
    </figcaption>
  </figure>
);

export default Testimonial;
