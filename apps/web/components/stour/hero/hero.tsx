import { Container } from "@/components/layouts/container";
import { Label } from "@/components/stour/label";
import { cn } from "@/lib/utils";

interface Props {
  dark?: boolean;
  description?: string;
  fullwidth?: boolean;
  label?: string;
  title: string;
}

const Text = ({ title, description, label, dark }: Props) => (
  <>
    {label && (
      <Label className={cn("ml-1", { "text-gray-400": dark })}>{label}</Label>
    )}
    <h2 className="pt-3 pb-6 font-semibold text-4xl">{title}</h2>
    {description && <div className="font-medium opacity-80">{description}</div>}
  </>
);

export const Hero = ({
  title,
  label,
  description,
  dark = false,
  fullwidth = false,
}: Props) => {
  if (!fullwidth) {
    return (
      <Text dark={dark} description={description} label={label} title={title} />
    );
  }
  return (
    <div className={cn(dark ? "bg-blue-950 text-white" : "text-gray-900")}>
      <Container>
        <div className="flex h-96 max-w-prose flex-col justify-center">
          <div className="my-auto">
            <Text description={description} label={label} title={title} />
          </div>
        </div>
      </Container>
    </div>
  );
};
