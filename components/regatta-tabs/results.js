import Button from "../stour/button";

const Item = (props) => <Button {...props} />;

function Results({ results, record }) {
  return (
    <div>
      <div className="pb-10 mx-auto prose">
        <p>Over the regatta weekend, the draw and nearly-live results are available here. We have an archive of results since 2002 (no regatta was held in 2020).</p>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {results.map((item, index) => (
          <Item href={item.link} key={index} label={item.year} title={item.year + " regatta results"} />
        ))}
        <Item href={record} label="Records" type="brand" />
      </div>
    </div>
  );
}

export default Results;
