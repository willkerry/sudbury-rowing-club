import React from "react";

import { Button } from "../components/stour/button";

export default {
  component: Button,
  title: "Elements/Button",
  parameters: {
    docs: {
      description: {
        component:
          "A CTA element that looks like a button and behaves like an `<a/>`.",
      },
    },
  },
};

const Template = (args) => (
  <Button {...args}/>
);
export const Primary = Template.bind({});
Primary.args = {
  label: "Let’s go"
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: "secondary",
  label: "Get a moodier button"
};

export const BrandDark = Template.bind({});
BrandDark.args = {
  type: "brandDark",
  label: "Go Oxford Blue!"
};

export const Brand = Template.bind({});
Brand.args = {
  type: "brand",
  label: "In inoffensive blue"
};

export const BrandLight = Template.bind({});
BrandLight.args = {
  type: "brandLight",
  label: "In 90s blue"
};

export const Success = Template.bind({});
Success.args = {
  type: "success",
  label: "Send application"
};

export const Error = Template.bind({});
Error.args = {
  type: "error",
  label: "Delete account"
};

export const Shadow = Template.bind({});
Shadow.args = {
  type: "brand",
  shadow: true,
  label: "Join us"
};

