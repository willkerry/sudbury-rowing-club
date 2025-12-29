import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Button } from "@/components/ui/button";
import { BackButton } from "./back-button";

export type LoadingStateProps = {
  verifiedUrl?: string;
  domain?: string;
  delay?: number;
};

export const LoadingState = ({
  verifiedUrl,
  domain,
  delay,
}: LoadingStateProps) => (
  <>
    <PageHeader prose title="Redirecting to external link" />

    <Container className="prose max-w-prose">
      <p>This link leads to another site and may no longer work.</p>

      <div className="flex justify-center">
        <Loader2 className="animate-spin text-gray-300" />
      </div>

      <p className="text-gray-600 text-sm">
        You will be redirected automatically in{" "}
        {typeof delay === "number" ? delay / 1000 : "a few"} seconds.
      </p>

      <div className="flex flex-col gap-4">
        {verifiedUrl && (
          <Button asChild icon={<ExternalLink />} variant="default">
            <Link href={verifiedUrl} rel="noopener noreferrer" target="_blank">
              Continue{domain ? ` to ${domain}` : ""}
            </Link>
          </Button>
        )}

        <BackButton>Back</BackButton>
      </div>
    </Container>
  </>
);
