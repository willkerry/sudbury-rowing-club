type Props = {
  caption: string;
};

const Caption = ({ caption }: Props) => (
  <figcaption className="bg-cover bg-bottom px-3 py-2 text-xs font-medium">
    {caption}
  </figcaption>
);

export default Caption;
