import Label from "@/components/stour/label";

const SectionHeading = ({ title, label }: { title: string; label: string }) => (
  <div className="my-16 text-center">
    <Label as="div" className="my-4">
      {label}
    </Label>
    <h2 className="text-5xl font-bold">{title}</h2>
  </div>
);

export default SectionHeading;
