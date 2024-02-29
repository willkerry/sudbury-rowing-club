import { useClipboard } from "@mantine/hooks";
import cn from "clsx";
import { Clipboard, ClipboardCheck } from "lucide-react";
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
      <span className="disambiguate select-all font-medium tracking-wider text-black">
        {value}
      </span>
      <span className="relative hidden select-none items-center text-xs font-semibold text-blue-500 opacity-0 transition group-hover:opacity-100 md:flex">
        <Clipboard aria-hidden className="absolute h-4 w-4" />
        <ClipboardCheck
          aria-hidden
          className={cn(
            "absolute h-4 w-4 transition-opacity ease-in-out duration-300",
            copied ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </button>
  );
};

export default Copy;
