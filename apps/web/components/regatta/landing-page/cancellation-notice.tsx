import { Container } from "@/components/layouts/container";
import { Text } from "@/components/stour/text";
import { cn } from "@/lib/utils";
import styles from "./cancellation-notice.module.css";

const GrassBorder = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "pointer-events-none absolute -inset-x-8 top-0 -bottom-4 z-0 bg-white",
      styles.grass,
      className,
    )}
  />
);

const HEADING_ID = "regatta-2026-notice-heading";

export const RegattaCancellationNotice = () => (
  <aside
    aria-labelledby={HEADING_ID}
    className="relative isolate mb-12 overflow-hidden bg-linear-to-b from-white to-amber-100"
  >
    <GrassBorder className={styles.mask} />

    <Container className="relative z-10 py-12 sm:py-14">
      <div className="relative mx-auto max-w-xl">
        <div
          aria-hidden
          className={cn("absolute inset-0 backdrop-blur-sm", styles.glass)}
        />
        <div className="relative p-6 sm:p-8">
          <h2 className="sr-only" id={HEADING_ID}>
            Sudbury Regatta 2026
          </h2>

          <Text className="text-black">
            <p>
              Many of you will already have seen that we are unable to run
              Sudbury Regatta 2026.
            </p>
            <p>
              This was not a decision that the Committee reached lightly.
              Changes to the management of the riverbank at Friars Meadow,
              introduced by the District Council to protect the habitat of the
              water vole population meant that we were unable to deliver the
              event safely and practically in the way expected by competitors,
              officials and spectators.
            </p>
            <p>
              We’re naturally very disappointed, as the Regatta is an important
              event for the Club and the local rowing calendar, and we hope
              we’ll be able to welcome you back to Sudbury in the future.
            </p>
          </Text>

          <p className="mt-6 font-medium text-gray-500 text-xs">
            Updated 28 July 2026
          </p>
        </div>
      </div>
    </Container>
  </aside>
);
