import { HeroTitle } from "@/components/stour/hero";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import recordJson from "./records.json";
import { transformRecords } from "./transformRecords";

const RecordsPage = () => {
  const records = transformRecords(recordJson);

  return (
    <>
      <HeroTitle title="Course records" breadcrumbs color="transparent" />

      <div className="p-4">
        <DataTable columns={columns} data={records} />
      </div>
    </>
  );
};

export default RecordsPage;
