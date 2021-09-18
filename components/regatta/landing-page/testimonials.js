import Label from "@/components/stour/label";
import Masonry from "@/components/stour/masonry";
import DayDateFormatter from "@/components/daydate-formatter";
import Testimonial from "@/components/stour/testimonial";
import ordinal from "@/lib/helpers/ordinal";

const Testimonials = ({ data }) => {
  return data.map((item, index) => {
    return (
      item.testimonials && (
        <div key={index} className="mb-24">
          <Masonry cols="3">
            <div className="py-24">
              <h3 className="text-xl font-medium">
                Praise for the {ordinal(item.number)} regatta
              </h3>
              <Label>
                <DayDateFormatter dateString={item.date} />
              </Label>
            </div>
            {item.testimonials.map((testimonial, index) => {
              return (
                <Testimonial
                  key={index}
                  name={testimonial.name}
                  organisation={testimonial.club}
                >
                  {testimonial.text}
                </Testimonial>
              );
            })}
          </Masonry>
        </div>
      )
    );
  });
};

export default Testimonials;
