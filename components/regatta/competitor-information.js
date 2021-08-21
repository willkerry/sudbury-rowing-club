import data from "@/data/regatta";
import Link from "@/components/stour/link";
import cn from "classnames";

function CompetitorInformation(props) {
  return (
    <div className={cn(props.tab && "mx-auto", "prose")}>
      {data.competitorInformation.intro}
      <div className="py-6 prose">
        <ul>
          {data.competitorInformation.resources.map((item, index) => (
            <CompetitorInfoItem key={index} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CompetitorInformation;

function CompetitorInfoItem({ item }) {
  return (
    <li key={item.index}>
      <Link href={item.link} download>
        {item.title}
      </Link>
    </li>
  );
}
