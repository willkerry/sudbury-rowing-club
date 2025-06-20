import { PageHeader } from "@/components/stour/hero/page-header";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import recordJson from "./records.json";
import { transformRecords } from "./transformRecords";

const RecordsPage = () => {
  const records = transformRecords(recordJson);

  return (
    <>
      <PageHeader title="Course records" breadcrumbs />

      <div className="p-4">
        <DataTable columns={columns} data={records} />
      </div>
    </>
  );
};

export default RecordsPage;
