import { GovGrid, SectionTitle } from "@/components/governance";
import { Link } from "@/components/stour/link";
import { sdk } from "@/lib/server/payload";
import { Officer } from "./officer";

const normalisePayloadReference = <T,>(
  value: T | string | null | undefined,
): T | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return null;
  }

  return value;
};

export const Officers = async () => {
  const { docs: officers } = await sdk.find({
    collection: "officers",
    limit: 100,
  });

  return (
    <section>
      <SectionTitle>Club Officers</SectionTitle>
      <GovGrid>
        {officers.map((officer) => {
          const occupant = normalisePayloadReference(officer.occupant);

          return (
            <Officer
              key={officer.id}
              officer={{
                description: officer.description ?? undefined,
                hasEmail: occupant?.hasEmail ?? false,
                id: officer.id,
                image:
                  normalisePayloadReference(occupant?.image)?.filename ??
                  undefined,
                occupant: occupant?.fullName ?? undefined,
                role: officer.role,
                vacant: !occupant,
              }}
            />
          );
        })}
      </GovGrid>

      <p className="py-12 text-gray-500 text-sm">
        The role descriptions provided above are abbreviated and for
        illustrative purposes only. Please refer to the{" "}
        <Link href="/governance/constitution">constitution</Link> for accurate
        details. If you wish to enquire about a vacant position, please{" "}
        <Link href="/contact?q=secretary">contact the club secretary</Link>.
      </p>
    </section>
  );
};
