type Props = {
  caption: string;
};

const Caption = ({ caption }: Props) => (
  <figcaption className="bg-bottom bg-cover px-3 py-2 font-medium text-xs">
    {caption}
  </figcaption>
);

export default Caption;
