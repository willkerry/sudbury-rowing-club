import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { ClubTag, findClub } from "@/components/regatta/results/club-tag";
import { PageHead } from "@/components/regatta/results/page-head";
import type { ClubData } from "@/lib/regatta/results";

export const ClubPage = ({ data }: { data: ClubData }) => {
  const club = findClub(data.code);
  const displayName = club?.name ?? data.name ?? data.code;
  const location = club?.location ?? null;
  const outboundLinks = [
    club?.website ? { href: club.website, label: "Club website" } : null,
    club?.href ? { href: club.href, label: "British Rowing profile" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <>
      <PageHead eyebrow={`Club · ${data.code}`} title={displayName} />

      <div className="mx-auto max-w-7xl px-4">
        <section className="mb-8 flex flex-wrap items-center gap-6 border-gray-200 border-b pb-6">
          <ClubTag code={data.code} size="hero" />

          <div className="min-w-0 space-y-1 text-sm">
            {location ? (
              <div className="text-gray-600">{location}</div>
            ) : club ? null : (
              <div className="text-gray-500 italic">
                Club not in our registry
              </div>
            )}

            {outboundLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-blue-600">
                {outboundLinks.map((link) => (
                  <a
                    className="inline-flex items-center gap-1 hover:underline"
                    href={link.href}
                    key={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ExternalLinkIcon className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <h2 className="mb-3 font-semibold text-lg">Entries</h2>

        {data.entries.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No entries recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-gray-300 border-b text-gray-600 text-xs uppercase tracking-wider">
                  <th className="py-2 pr-4 text-left font-semibold">Event</th>
                  <th className="py-2 pr-4 text-left font-semibold">Crew</th>
                  <th className="py-2 pr-4 text-right font-semibold">No.</th>
                  <th className="py-2 text-right font-semibold">First race</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry, i) => (
                  <tr
                    className="border-gray-100 border-b hover:bg-gray-50"
                    key={`${entry.number}-${i}`}
                  >
                    <td className="py-2 pr-4">
                      {entry.eventHref ? (
                        <Link
                          className="text-blue-600 hover:underline"
                          href={entry.eventHref}
                        >
                          {entry.eventName}
                        </Link>
                      ) : (
                        entry.eventName
                      )}
                    </td>
                    <td className="py-2 pr-4">{entry.crewName}</td>
                    <td className="py-2 pr-4 text-right font-mono text-gray-600">
                      {entry.number}
                    </td>
                    <td className="py-2 text-right font-mono text-gray-600">
                      {entry.firstRaceTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
