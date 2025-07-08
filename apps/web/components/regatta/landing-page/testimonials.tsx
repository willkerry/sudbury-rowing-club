import { Label } from "@/components/stour/label";
import Masonry from "@/components/stour/masonry";
import Testimonial, {
  type TestimonialType,
} from "@/components/stour/testimonial/testimonial";
import DateFormatter from "@/components/utils/date-formatter";
import { ordinal } from "@sudburyrc/helpers";

type Regatta = {
  _id: string;
  number: number;
  date: string;
  testimonials: TestimonialType[] | null;
};

export const Testimonials = ({ regattas }: { regattas: Regatta[] }) => (
  <>
    {regattas.map(
      (year) =>
        year.testimonials && (
          <div key={year._id} className="mb-24">
            <Masonry>
              <div className="py-8 sm:py-24">
                <h3 className="font-medium text-xl">
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
