import cn from "@/lib/cn";

export type NoteProps = {
  children: React.ReactNode;
  className?: string;
  type?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "small" | "large";
  centered?: boolean;
  label?: string;
};

const SIZE_MAP = {
  small: "py-2 px-3 prose-sm my-5",
  large: "py-3 px-5 prose my-5",
};

const VARIANT_MAP = {
  primary: "text-black",
  secondary: "text-gray-500",
  success: "text-green-700 border-green-500",
  error: "text-red-600 border-red-400",
  warning: "text-yellow-600 border-yellow-400",
};

const Note = ({
  children,
  className,
  type = "primary",
  size = "large",
  centered = false,
  label,
}: NoteProps) => {
  const variantClassNames = VARIANT_MAP[type];
  const sizeClassNames = SIZE_MAP[size];
  const centeredClassNames = centered ? "mx-auto max-w-prose" : "max-w-none";

  const noteClasses = cn(
    "border rounded-md max-w-prose prose",
    centeredClassNames,
    variantClassNames,
    sizeClassNames,
    className
  );

  return (
    <div className={noteClasses}>
      {label && <span className="pr-1.5 font-semibold">{label}:</span>}
      {children}
    </div>
  );
};

export default Note;
