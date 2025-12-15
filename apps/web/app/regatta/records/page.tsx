import { PageHeader } from "@/components/stour/hero/page-header";
import { createMetadata } from "@/lib/create-metadata";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import recordJson from "./records.json";
import { transformRecords } from "./transformRecords";

export const metadata = createMetadata({
  title: "Course Records | Sudbury Regatta",
  description:
    "View all course records from the Sudbury Regatta, spanning decades of competitive rowing.",
  image: { title: "Course Records 🏆" },
});

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
