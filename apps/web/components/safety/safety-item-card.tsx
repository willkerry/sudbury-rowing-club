import { Download, ExternalLink } from "react-feather";
import { BASE_URL } from "lib/constants";
import Text from "@/components/stour/text";
import Button from "@/components/stour/button";
import DateFormatter from "@/components/utils/date-formatter";
import Link from "@/components/stour/link";
import { SafetyResponse } from "@sudburyrc/api";

const URGENT_WORDS = ["emergency", "urgent", "important", "critical", "danger"];

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
    <h2 className="tracking-tightmd:pr-6 mb-2 line-clamp-1 font-semibold leading-tight">
      {children}
    </h2>
  </Link>
);

const SafetyItemUpdatedAt = ({ date }: { date: string }) => (
  <div className="mb-2 text-xs font-medium text-gray-500">
    Updated on <DateFormatter dateString={date} />
  </div>
);

const SafetyItemLinkButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Button
    href={href}
    as="a"
    size="small"
    className="w-full"
    icon={href.includes(BASE_URL) ? <Download /> : <ExternalLink />}
  >
    {children}
  </Button>
);

const SafetyItemDownloadButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Button
    as="a"
    href={`${href}?dl=`}
    icon={<Download />}
    className="w-full"
    size="small"
  >
    {children}
  </Button>
);

export const SafetyItemCard = ({
  _id,
  _updatedAt,
  title,
  body,
  link,
  document,
}: SafetyResponse) => (
  <div key={_id} id={_id} data-updated-at={_updatedAt}>
    <SafetyItemBorder isEmergency={containsUrgentWords(title)}>
      <SafetyItemUpdatedAt date={_updatedAt} />
      <SafetyItemTitle href={`safety/${_id}`}>{title}</SafetyItemTitle>

      {body && (
        <Text portableText={body.slice(0, 1)} className="prose-sm mb-4" />
      )}

      <div className="space-y-2">
        {link && (
          <SafetyItemLinkButton href={link.url}>
            {link.title}
          </SafetyItemLinkButton>
        )}
        {document && (
          <SafetyItemDownloadButton href={document.url}>
            {document.title}
          </SafetyItemDownloadButton>
        )}
      </div>
    </SafetyItemBorder>
  </div>
);
