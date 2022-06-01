import Label from "@/components/stour/label";
import Masonry from "@/components/stour/masonry";
import DayDateFormatter from "@/components/utils/daydate-formatter";
import Testimonial from "@/components/stour/testimonial";
import ordinal from "@/lib/helpers/ordinal";
import type TestimonialType from "../../../types/testimonial";

type Props = {
  data: [
    {
      _id: string;
      date: string;
      number: number;
      testimonials: TestimonialType[];
    }
  ];
};

const Testimonials = ({ data }: Props) =>
  data.map(
    (year) =>
      year.testimonials && (
        <div key={year._id} className="mb-24">
          <Masonry>
            <div className="py-24">
              <h3 className="text-xl font-medium">
                Praise for the {ordinal(year.number)} regatta
              </h3>
              <Label>
                <DayDateFormatter dateString={year.date} />
              </Label>
            </div>
            {year.testimonials.map((testimonial, i) => (
              <Testimonial
                key={i}
                name={testimonial.name}
                club={testimonial.club}
                text={testimonial.text}
              />
            ))}
          </Masonry>
        </div>
      )
  );

export default Testimonials;
