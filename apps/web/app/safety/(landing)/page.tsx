import { SafetyItemCard } from "@/components/safety/safety-item-card";
import { createMetadata } from "@/lib/create-metadata";
import { fetchSafety } from "@sudburyrc/api";
import React from "react";

export const metadata = createMetadata({
  title: "Safety",
  description: "Safety information from Sudbury Rowing Club.",
});

const getSafetyItems = async () => {
  const safetyItems = await fetchSafety();

  const pinned = safetyItems.filter((item) => item.pin);
  const unpinned = safetyItems.filter((item) => !item.pin);

  return [...pinned, ...unpinned];
};

const Safety = async () => {
  const safetyItems = await getSafetyItems();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {safetyItems.map((item) => (
        <SafetyItemCard key={item._id} {...item} />
      ))}
    </div>
  );
};

export default Safety;
