import React from "react";

import { Masonry } from "../components/stour/masonry";

export default {
  component: Masonry,
  title: "Layout/Masonry",
  parameters: {
    docs: {
      description: {
        component: "Get a masonry layout.",
      },
    },
  },
};

const Template = (args) => (
  <Masonry {...args}>
    <img
      src="https://picsum.photos/41/50/?blur=10"
      width="100%"
      className="inline-block mb-10 rounded-lg break-insde"
    />
    <img
      src="https://picsum.photos/60/40/?blur=10"
      width="100%"
      className="inline-block mb-10 rounded-lg break-insde"
    />
    <img
      src="https://picsum.photos/50/50/?blur=10"
      width="100%"
      className="inline-block mb-10 rounded-lg break-insde"
    />
    <img
      src="https://picsum.photos/61/40/?blur=10"
      width="100%"
      className="inline-block mb-10 rounded-lg break-insde"
    />
    <img
      src="https://picsum.photos/40/50/?blur=10"
      width="100%"
      className="inline-block mb-10 rounded-lg break-insde"
    />
  </Masonry>
);
export const Default = Template.bind({});
Default.args = {
};
