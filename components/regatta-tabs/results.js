import Link from "@/components/stour/link";

function Results({ results, record }) {
  return (
    <div className="grid md:grid-cols-2">
      <div>
        <Link href={record}>Course records (Updated 2019)</Link>
      </div>
      <div className="">
        <ul>
          
          {results.map((item, index) => (
            <li key={index} className="">
              <Link icon href={item.link}>
                {"Regatta " + item.year}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Results;
