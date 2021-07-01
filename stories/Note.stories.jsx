import React from "react";

import { Note } from "../components/stour/note";

export default {
  component: Note,
  title: "Elements/Note",
  parameters: {
    docs: {
      description: {
        component:
          "Display text that requires attention or provides additional information.",
      },
    },
  },
};

const Template = (args) => (
  <Note {...args}>This is a very important note.</Note>
);
export const Default = Template.bind({});
Default.args = {};

export const Secondary = Template.bind({});
Secondary.args = {
  type: "secondary",
};

export const Success = Template.bind({});
Success.args = {
  type: "success",
};
export const Warning = Template.bind({});
Warning.args = {
  type: "warning",
};
export const Error = Template.bind({});
Error.args = {
  type: "error",
};
export const Label = Template.bind({});
Label.args = {
  label: "With a label",
};
Label.parameters = {
  docs: {
    description: {
      story: 'Add a short label to the note element.',
    },
  },
};
export const Small = Template.bind({});
Small.args = {
  size: "small",
};
Small.parameters = {
  docs: {
    description: {
      story: 'A more compact sort of a note.',
    },
  },
};
