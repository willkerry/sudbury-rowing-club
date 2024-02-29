import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
        description:
          "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400",
        actionButton: "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
        cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
      },
    }}
    {...props}
  />
);

export { Toaster };
