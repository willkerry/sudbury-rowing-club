import { clampString, getInitials } from "@sudburyrc/helpers";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Identity } from "./identity";

type FromAndToRouteProps = {
  isOpen: boolean;
  from: {
    name: string;
    email: string;
    isPlaceholder: boolean;
  };
  to?: {
    name?: string;
    role?: string;
    avatar?: {
      _id: string;
      lqip: string;
    };
  };
};

export const FromAndTo = ({ isOpen, from, to }: FromAndToRouteProps) => {
  const fromEmailIsValid =
    from.email === "Placeholder" || !!z.email().safeParse(from.email).success;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{
            height: "auto",
            opacity: 1,
            scale: 1,
          }}
          aria-hidden
          className="col-span-2 origin-top"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0, scale: 0.9 }}
          key="identity"
          transition={{ type: "spring" }}
        >
          <div className="mb-4 flex items-center justify-between gap-4 overflow-hidden rounded-sm border bg-gray-50 p-2">
            <Identity
              className={cn(from?.isPlaceholder && "opacity-50")}
              description={clampString(from?.email, 20)}
              fallback={getInitials(from?.name)}
              highlightDescription={!fromEmailIsValid}
              name={from?.name}
            />

            <div className="flex items-center justify-center">
              <ArrowRight
                aria-hidden
                className={cn("h-4 w-4", "text-gray-400")}
              />
            </div>

            <Identity
              className="self-start"
              description={to?.role}
              fallback={getInitials(to?.name)}
              imageId={to?.avatar?._id || undefined}
              key={to?.avatar?._id}
              lqip={to?.avatar?.lqip}
              name={to?.name}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
