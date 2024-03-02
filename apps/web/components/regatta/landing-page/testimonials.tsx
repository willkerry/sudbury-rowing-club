import { type Regatta } from "@sudburyrc/api";
import ordinal from "@/lib/helpers/ordinal";
import Label from "@/components/stour/label";
import Masonry from "@/components/stour/masonry";
import Testimonial from "@/components/stour/testimonial";
import DateFormatter from "@/components/utils/date-formatter";

const Testimonials = ({ regattas }: { regattas: Regatta[] }) => (
  <>
    {regattas.map(
      (year) =>
        year.testimonials && (
          <div key={year._id} className="mb-24">
            <Masonry>
              <div className="py-8 sm:py-24">
                <h3 className="text-xl font-medium">
                  Praise for the {ordinal(year.number)} regatta
                </h3>
                <Label>
                  <DateFormatter dateString={year.date} format="long" />
                </Label>
              </div>
              {year.testimonials.map((testimonial) => (
                <Testimonial key={testimonial._key} {...testimonial} />
              ))}
            </Masonry>
          </div>
        ),
    )}
  </>
);

export default Testimonials;
