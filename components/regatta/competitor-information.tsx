import cn from "classnames";
import Link from "@/components/stour/link";

type Props = {
  tab?: boolean;
  description: string;
  items?: { _id: string; title: string; url: string; extension: string }[];
};

const CompetitorInformation = ({ tab = false, description, items }: Props) => (
  <div className={cn(tab && "mx-auto", "prose")}>
    {description}
    <div className="py-6 prose">
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
  </div>
);

export default CompetitorInformation;
