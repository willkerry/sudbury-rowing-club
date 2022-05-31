import cn from "classnames";
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
    <h2 className="pt-3 pb-6 text-4xl font-semibold tracking-tighter">
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
    <div className={cn(dark ? "text-white bg-blue-900" : "text-gray-900")}>
      <Container>
        <div className="flex flex-col h-96 justify-content-center max-w-prose">
          <div className="my-auto">
            <Text title={title} label={label} description={description} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
