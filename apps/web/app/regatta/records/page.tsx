import { PageHeader } from "@/components/stour/hero/page-header";
import { createMetadata } from "@/lib/create-metadata";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { transformRecords } from "./load-records";
import recordJson from "./records.json";

export const metadata = createMetadata({
  description:
    "View all course records from the Sudbury Regatta, spanning decades of competitive rowing.",
  image: { title: "Course Records 🏆" },
  title: "Course Records | Sudbury Regatta",
});

const RecordsPage = async () => {
  const records = await transformRecords(recordJson);

  return (
    <>
      <PageHeader breadcrumbs title="Course records" />

      <div className="p-4">
        <DataTable columns={columns} data={records} />
      </div>
    </>
  );
};

export default RecordsPage;
