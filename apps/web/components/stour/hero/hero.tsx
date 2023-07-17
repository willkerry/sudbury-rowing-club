import cn from "@sudburyrc/cn";
import Label from "@/components/stour/label";
import Container from "../../layouts/container";

interface Props {
  title: string;
  label?: string;
  description?: string;
  dark?: boolean;
  fullwidth?: boolean;
}

const Text = ({ title, description, label }: Props) => (
  <>
    {label && <Label className="ml-1">{label}</Label>}
    <h2 className="pb-6 pt-3 text-4xl font-semibold tracking-tighter">
      {title}
    </h2>
    {description && <div className="font-medium opacity-80">{description}</div>}
  </>
);

const Hero: React.FC<Props> = ({
  title,
  label,
  description,
  dark = false,
  fullwidth = false,
}) => {
  if (!fullwidth) {
    return <Text title={title} label={label} description={description} />;
  }
  return (
    <div className={cn(dark ? "bg-blue-900 text-white" : "text-gray-900")}>
      <Container>
        <div className="justify-content-center flex h-96 max-w-prose flex-col">
          <div className="my-auto">
            <Text title={title} label={label} description={description} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
