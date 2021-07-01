import React from "react";

import { Hero } from "../components/stour/hero";

export default {
  component: Hero,
  title: "Components/Hero",
  parameters: {
    docs: {
      description: {
        component: "A pretty title to reuse ad nauseum.",
      },
    },
  },
};

const Template = (args) => <Hero {...args} />;
export const Default = Template.bind({});
Default.args = {
  title:
    "Some of the people who’ve come to our regatta have said lovely things about it",
  label: "Feedback",
  description: "",
  fullwidth: true,
};
