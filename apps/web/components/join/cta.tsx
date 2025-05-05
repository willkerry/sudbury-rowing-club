import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/utils/scroll-link";
import type { ComponentProps } from "react";

type CTALinkProps = {
  to: string;
  variant?: ComponentProps<typeof Button>["variant"];
  children: React.ReactNode;
};
type CTATextProps = { first: string; second: string };

const CTALink = ({ to, variant, children }: CTALinkProps) => (
  <div className="flex justify-center">
    <ScrollLink duration={300} offset={-30} smooth spy to={to}>
      <Button size="lg" variant={variant}>
        {children}
      </Button>
    </ScrollLink>
  </div>
);

const CTAText = ({ first, second }: CTATextProps) => (
  <p className="text-center">
    <span className="font-medium text-gray-800 text-xl">{first}</span>
    <br />
    <span className="text-gray-500">{second}</span>
  </p>
);

const CTADivider = () => <span className="block h-6" />;

const CTASection = ({
  to,
  variant,
  first,
  second,
  children,
}: CTALinkProps & CTATextProps) => (
  <div>
    <CTAText first={first} second={second} />
    <CTADivider />
    <CTALink to={to} variant={variant}>
      {children}
    </CTALink>
  </div>
);

const JoinCTA = () => (
  <div className="grid gap-12 rounded-sm border bg-gray-50 p-12 md:grid-cols-2">
    <CTASection
      to="l2r"
      variant="secondary"
      first="New to the sport?"
      second="Our Learn to Row programme is for you."
    >
      Learn to Row
    </CTASection>

    <CTASection
      to="experienced"
      first="Already an active rower?"
      second="Contact a vice-captain for more information."
    >
      How to join
    </CTASection>
  </div>
);

export default JoinCTA;
