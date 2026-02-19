import cn from "clsx";
import { Container } from "@/components/layouts/container";
import { Label } from "@/components/stour/label";

interface Props {
  dark?: boolean;
  description?: string;
  fullwidth?: boolean;
  label?: string;
  title: string;
}

const Text = ({ title, description, label }: Props) => (
  <>
    {label && <Label className="ml-1">{label}</Label>}
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
    return <Text description={description} label={label} title={title} />;
  }
  return (
    <div className={cn(dark ? "bg-blue-950 text-white" : "text-gray-900")}>
      <Container>
        <div className="justify-content-center flex h-96 max-w-prose flex-col">
          <div className="my-auto">
            <Text description={description} label={label} title={title} />
          </div>
        </div>
      </Container>
    </div>
  );
};
