"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";

export const BackButton = ({
  variant = "secondary",
  onClick,
  ...props
}: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      onClick={onClick ?? (() => router.back())}
      variant={variant}
      {...props}
    />
  );
};
