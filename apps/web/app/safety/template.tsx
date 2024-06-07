import { PageTransitionEffect } from "@/components/utils/page-transition";

export default function rootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransitionEffect>{children}</PageTransitionEffect>;
}
