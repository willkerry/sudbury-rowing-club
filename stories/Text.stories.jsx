import React from "react";

import { Text } from "../components/stour/text";

export default {
  component: Text,
  title: "Elements/Text",
  parameters: {
    docs: {
      description: {
        component: "Quickly format text using `@tailwindcss/typography`.",
      },
    },
  },
};

const Template = (args) => (
  <Text {...args}>
    <p>My diesel Citröen has run out of diesel, and that’s a pain.</p>
    <ol type="i">
      <li>first list item</li>
      <li>second list item</li>
      <li>third list item</li>
    </ol>
    <figure>
      <blockquote cite="https://gutenberg.org/files/1289/1289-0.txt">
        <p>
          Then he went on. “I have no peace or rest for it. It calls to me, for
          many minutes together, in an agonised manner, ‘Below there! Look out!
          Look out!’ It stands waving to me. It rings my little bell—”
        </p>
      </blockquote>
      <figcaption>
        Charles Dickens, <cite>The Signalman</cite>, 1866
      </figcaption>
    </figure>
  </Text>
);
export const Default = Template.bind({});
Default.args = {};
