"use client";

import { useClipboard } from "@mantine/hooks";
import { CheckIcon, Clipboard } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Copy = ({ value }: { value: string }) => {
  const { copy, copied, error } = useClipboard();

  const handleClick = () => {
    copy(value);

    if (!error) {
      toast.success("Copied to clipboard");
      return;
    }

    toast.error("Failed to copy to clipboard");
  };

  return (
    <button
      className="group inline-flex items-center gap-1"
      onClick={handleClick}
      type="button"
    >
      <span className="disambiguate select-all font-medium text-black tracking-wider">
        {value}
      </span>
      <span
        className={cn(
          "relative mb-0.5 hidden select-none items-center font-semibold text-blue-500 text-xs opacity-0 md:flex",
          "transition-opacity duration-300 group-hover:opacity-100 data-[copied=true]:opacity-100",
        )}
        data-copied={copied}
      >
        <Clipboard aria-hidden className="absolute h-4 w-4" />
        <AnimatePresence>
          {copied && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="absolute h-4 w-4"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: -5 }}
              transition={{ damping: 20, stiffness: 300, type: "spring" }}
            >
              <CheckIcon
                aria-hidden
                className="mx-auto mt-1.5 h-1.5 w-1.5 stroke-[5px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
};
