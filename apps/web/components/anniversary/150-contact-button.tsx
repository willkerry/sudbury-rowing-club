import Link from "next/link";
import { Button, type ButtonProps } from "../ui/button";

const RECIPIENT = "will";

export const HundredAndFiftyContactButton = ({
  children,
  message,
  ...props
}: ButtonProps & { message?: string }) => {
  const href = `/contact?q=${encodeURIComponent(RECIPIENT)}${
    message ? `&message=${encodeURIComponent(message)}` : ""
  }` as const;

  return (
    <Button asChild {...props}>
      <Link href={href}>{children || "Message us"}</Link>
    </Button>
  );
};
