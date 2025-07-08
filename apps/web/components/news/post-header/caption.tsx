type Props = {
  caption: string;
};

export const Caption = ({ caption }: Props) => (
  <figcaption className="bg-bottom bg-cover px-3 py-2 font-medium text-xs">
    {caption}
  </figcaption>
);
