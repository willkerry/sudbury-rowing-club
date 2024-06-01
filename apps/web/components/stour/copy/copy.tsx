import { cn } from "@/lib/utils";
import { useClipboard } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, Clipboard } from "lucide-react";
import { toast } from "sonner";

const Copy = ({ value }: { value: string }) => {
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
      type="button"
      className="group inline-flex items-center gap-1"
      onClick={handleClick}
    >
      <span className="disambiguate select-all font-medium text-black tracking-wider">
        {value}
      </span>
      <span
        data-copied={copied}
        className={cn(
          "relative hidden select-none items-center font-semibold text-blue-500 text-xs opacity-0 md:flex",
          "transition-opacity data-[copied=true]:opacity-100 group-hover:opacity-100",
        )}
      >
        <Clipboard aria-hidden className="absolute h-4 w-4" />
        <AnimatePresence>
          {copied && (
            <motion.div
              className="absolute h-4 w-4"
              initial={{ opacity: 0, translateY: -5 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
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

export default Copy;
