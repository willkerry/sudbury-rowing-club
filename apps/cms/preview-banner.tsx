import { Card, Text } from "@sanity/ui";
import type { NavbarProps } from "sanity";

export const prNumber = import.meta.env.SANITY_STUDIO_PR_NUMBER;

export const PreviewNavbar = (props: NavbarProps) => (
  <>
    <Card padding={3} tone="caution">
      <Text align="center" size={1} weight="medium">
        Preview Studio for pull request #{prNumber}. Changes you publish here go
        straight to the live website.
      </Text>
    </Card>
    {props.renderDefault(props)}
  </>
);
