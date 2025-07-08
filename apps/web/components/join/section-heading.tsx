import Label from "@/components/stour/label";

export const SectionHeading = ({
  title,
  label,
}: {
  title: string;
  label: string;
}) => (
  <div className="my-16 text-center">
    <Label as="div" className="my-4">
      {label}
    </Label>
    <h2 className="font-bold text-5xl">{title}</h2>
  </div>
);
