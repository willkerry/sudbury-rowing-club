import Link from "next/link";
import { Button, type ButtonProps } from "../ui/button";
import { join } from "./nav-data";

type JoinLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> &
  Pick<ButtonProps, "size">;

export const JoinLink = ({
  className,
  size = "xs",
  ...props
}: JoinLinkProps) => (
  <Button asChild className={className} size={size}>
    <Link href={join.href} {...props}>
      {join.name}
    </Link>
  </Button>
);
