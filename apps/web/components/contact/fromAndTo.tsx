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
    from.email === "Placeholder" ||
    !!z.string().email().safeParse(from.email).success;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="identity"
          initial={{ height: 0, scale: 0.9, opacity: 0 }}
          animate={{
            height: "auto",
            scale: 1,
            opacity: 1,
          }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring" }}
          className="col-span-2 origin-top"
          aria-hidden
        >
          <div className="mb-4 flex items-center justify-between gap-4 overflow-hidden rounded-sm border bg-gray-50 p-2">
            <Identity
              fallback={getInitials(from?.name)}
              name={from?.name}
              description={clampString(from?.email, 20)}
              highlightDescription={!fromEmailIsValid}
              className={cn(from?.isPlaceholder && "opacity-50")}
            />

            <div className="flex items-center justify-center">
              <ArrowRight
                aria-hidden
                className={cn("h-4 w-4", "text-gray-400")}
              />
            </div>

            <Identity
              key={to?.avatar?._id}
              fallback={getInitials(to?.name)}
              name={to?.name}
              description={to?.role}
              imageId={to?.avatar?._id || undefined}
              lqip={to?.avatar?.lqip}
              className="self-start"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
