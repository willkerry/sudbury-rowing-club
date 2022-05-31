type Props = {
  caption: string;
};

const Caption = ({ caption }: Props) => (
  <figcaption className="px-3 py-2 text-xs font-medium bg-bottom bg-cover">
    {caption}
  </figcaption>
);

export default Caption;
