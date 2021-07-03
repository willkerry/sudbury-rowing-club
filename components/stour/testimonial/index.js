import cn from "classnames";
import { PropTypes } from "prop-types";
import ReactMarkdown from "react-markdown";
import { ShieldCheckIcon } from "@heroicons/react/solid";

function Anonymous() {
  return (
    <div className="flex">
      <ShieldCheckIcon className="inline-flex w-4 h-4 mr-1 text-gray-300" />
      <div className="inline-flex mt-px text-xs tracking-widest text-gray-600 uppercase">Anonymous</div>
    </div>
  );
}

export function Testimonial(props) {
  const { children, name, organisation, shadow } = props;
  return (
    <figure
      className={cn("inline-block p-6 mb-10 border rounded-xl break-inside", {
        "shadow-xl": shadow,
      })}
    >
      <blockquote
        className={cn(
          "space-y-4 leading-snug",
          {
            "text-sm text-gray-800 hyphens-auto": children.length > 250,
          },
          {
            "text-lg font-light text-black": children.length < 250,
          }
        )}
      >
        <ReactMarkdown>{children}</ReactMarkdown>
      </blockquote>
      <figcaption className="pt-5 font-medium leading-snug">
        <p className="text-gray-800">{name ? name : <Anonymous />}</p>
        {organisation ? (
          <p className="text-sm text-gray-500">{organisation}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}

Testimonial.propTypes = {
  /**
   * Optionally provide the name of the testimonial-writer.
   */
  name: PropTypes.string,
  /**
   * ...and optionally provide the name of that person’s organisation.
   */
  organisation: PropTypes.string,
};

export default Testimonial;
