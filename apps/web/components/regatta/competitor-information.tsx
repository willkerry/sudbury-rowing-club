import Link from "@/components/stour/link";
import { cn } from "@/lib/utils";

type Props = {
  tab?: boolean;
  description: string;
  items?: { _id: string; title: string; url: string; extension: string }[];
};

const CompetitorInformation = ({ tab = false, description, items }: Props) => (
  <div className={cn("prose", tab && "prose-sm mx-auto")}>
    <p>{description}</p>

    <ul>
      {items?.map((item) => (
        <li key={item._id}>
          <Link
            href={`${item.url}?dl=`}
            download
            aria-label={`Download ${item.title}`}
            extension={item.extension}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default CompetitorInformation;
