import data from "@/data/regatta";
import Link from "@/components/stour/link";
import cn from "classnames";

function CompetitorInformation({ tab, description, items }) {
  return (
    <div className={cn(tab && "mx-auto", "prose")}>
      {description}
      <div className="py-6 prose">
        <ul>
          {console.log(items)}
          {items.map((item) => (
            <li key={item._id}>
              <Link
                href={item.url}
                download
                aria-label={"Download" + " " + item.title}
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
}

export default CompetitorInformation;
