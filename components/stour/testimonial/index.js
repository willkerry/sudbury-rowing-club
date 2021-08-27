import cn from "classnames";
import { PropTypes } from "prop-types";
import { ShieldCheckIcon } from "@heroicons/react/solid";

function Anonymous() {
  return (
    <div className="flex">
      <ShieldCheckIcon className="inline-flex w-4 h-4 mr-1 text-gray-300" />

      <div>
        Anonymous
        <style jsx>{`
          div {
            display: inline-flex;
            margin-top: 2px;
            font-size: 0.7em;
            letter-spacing: 0.1em;
            color: rgb(75, 85, 99);
            text-transform: uppercase;
            @apply inline-flex mt-px text-xs tracking-widest text-gray-600 uppercase;
          }
        `}</style>
      </div>
    </div>
  );
}

export function Testimonial(props) {
  const { children, name, organisation } = props;
  return (
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
          {
            "text-sm text-gray-800 hyphens-auto": children.length > 250,
          },
          {
            "text-lg font-light text-black": children.length < 250,
          }
        )}
      >
        {children}
      </blockquote>
      <figcaption className="pt-5 font-medium leading-snug">
        <div className="text-gray-800">{name ? name : <Anonymous />}</div>
        {organisation ? (
          <div className="text-sm text-gray-500">{organisation}</div>
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
