import Link from "@/components/stour/link";
import Text from "@/components/stour/text";
import { Button } from "@/components/ui/button";
import DateFormatter from "@/components/utils/date-formatter";
import type { SafetyResponse } from "@sudburyrc/api";
import { BASE_URL } from "lib/constants";
import { Download, ExternalLink } from "lucide-react";
import NextLink from "next/link";
import { first, isArray } from "radash";

const URGENT_WORDS = ["emergency", "urgent", "critical"];

const containsUrgentWords = (title: string) =>
  URGENT_WORDS.some((word) => title.toLowerCase().includes(word));

const SafetyItemBorder = ({
  isEmergency,
  children,
}: {
  isEmergency: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={`rounded-lg border p-2 ${
      isEmergency ? "border-2 border-red-400" : "bg-white"
    }`}
  >
    {children}
  </div>
);

const SafetyItemTitle = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-gray-900 transition hover:text-blue-500 hover:underline"
  >
    <h2 className="mb-2 line-clamp-1 font-semibold leading-tight">
      {children}
    </h2>
  </Link>
);

const SafetyItemUpdatedAt = ({ date }: { date: string }) => (
  <div className="mb-2 font-medium text-gray-500 text-xs">
    Updated on <DateFormatter dateString={date} />
  </div>
);

const SafetyItemLinkButton = ({
  href,
  children,
  isEmergency,
}: {
  href: string;
  children: React.ReactNode;
  isEmergency: boolean;
}) => (
  <Button
    asChild
    size="xs"
    variant={isEmergency ? "destructive" : "tertiary"}
    className="w-full"
    icon={
      href.includes(BASE_URL) ? (
        <Download className="h-3 w-3" />
      ) : (
        <ExternalLink className="h-3 w-3" />
      )
    }
  >
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  </Button>
);

const SafetyItemDownloadButton = ({
  href,
  children,
  isEmergency,
}: {
  href: string;
  children: React.ReactNode;
  isEmergency: boolean;
}) => (
  <Button
    icon={<Download className="h-3 w-3" />}
    className="w-full"
    size="xs"
    variant={isEmergency ? "destructive" : "tertiary"}
    asChild
  >
    <a href={`${href}?dl=`} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  </Button>
);

export const SafetyItemCard = ({
  _id,
  _updatedAt,
  title,
  body,
  link,
  document,
}: SafetyResponse) => {
  const permalink = `safety/${_id}`;
  const firstParagraph = body ? first(body) : null;
  const hasMultipleParagraphs = isArray(body) && body.length > 1;
  const isAnUrgentItem = containsUrgentWords(title);

  return (
    <div key={_id} id={_id} data-updated-at={_updatedAt}>
      <SafetyItemBorder isEmergency={isAnUrgentItem}>
        <SafetyItemUpdatedAt date={_updatedAt} />
        <SafetyItemTitle href={permalink}>{title}</SafetyItemTitle>

        {firstParagraph && (
          <Text portableText={firstParagraph} className="prose-sm mb-4" />
        )}

        <div className="space-y-2">
          {hasMultipleParagraphs && (
            <Button asChild variant="secondary" className="w-full">
              <NextLink href={permalink}>More</NextLink>
            </Button>
          )}

          {link && (
            <SafetyItemLinkButton href={link.url} isEmergency={isAnUrgentItem}>
              {link.title}
            </SafetyItemLinkButton>
          )}

          {document && (
            <SafetyItemDownloadButton
              href={document.url}
              isEmergency={isAnUrgentItem}
            >
              {document.title}
            </SafetyItemDownloadButton>
          )}
        </div>
      </SafetyItemBorder>
    </div>
  );
};
