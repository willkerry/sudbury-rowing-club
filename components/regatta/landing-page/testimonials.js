import randomUUID from "crypto";
import Label from "@/components/stour/label";
import Masonry from "@/components/stour/masonry";
import DayDateFormatter from "@/components/utils/daydate-formatter";
import Testimonial from "@/components/stour/testimonial";
import ordinal from "@/lib/helpers/ordinal";

const Testimonials = ({ data }) =>
  data.map(
    (item) =>
      item.testimonials && (
        <div
          key={`${item.number}${item.testimonials[0].text.substring(8, 12)}`}
          className="mb-24"
        >
          <Masonry cols="3">
            <div className="py-24">
              <h3 className="text-xl font-medium">
                Praise for the {ordinal(item.number)} regatta
              </h3>
              <Label>
                <DayDateFormatter dateString={item.date} />
              </Label>
            </div>
            {item.testimonials.map((testimonial) => (
              <Testimonial
                key={`${testimonial.text
                  .substring(8, 16)
                  .replace(/\s/g, "")}-${randomUUID
                  .randomBytes(1)
                  .toString("hex")}`}
                name={testimonial.name}
                organisation={testimonial.club}
              >
                {testimonial.text}
              </Testimonial>
            ))}
          </Masonry>
        </div>
      )
  );

export default Testimonials;
