import React from "react";
import { Testimonial } from "../components/stour/testimonial";

export default {
  component: Testimonial,
  title: "Components/Testimonial",
  parameters: {
    docs: {
      description: {
        component: "A simple testionial component.",
      },
    },
  },
};

const Template = (args, children) => (
  <Testimonial {...args}/>
);
export const Default = Template.bind({});
Default.args = {
  name: "Jean Forgeron",
  organisation: "Club d’aviron de Paris",
  children: "A fantastic regatta as always – you have set yourself a high standard that others would love to get near."
};
export const Long = Template.bind({});
Long.args = {
  name: "Jean Forgeron",
  organisation: "Club d’aviron de Paris",
  children: "Thanks for another great regatta at Sudbury. The course is a joy whether you’re racing or spectating and the umpires, marshals and race control are all really helpful. The excellent barbeque, cake stalls and beer tent will keep you fuelled to the finish and the commentary is very entertaining."
};
Long.parameters = {
  docs: {
    description: {
      story: 'Text size is automatically reduced for longer testimonial strings.',
    },
  },
};