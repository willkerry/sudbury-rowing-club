import { fetchSafety, type SafetyResponse } from "@sudburyrc/api";
import { fork } from "radash";
import { SafetyItemCard } from "@/components/safety/safety-item-card";
import { containsUrgentWords } from "@/lib/contains-urgent-words";
import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  title: "Safety",
  description: "Safety information from Sudbury Rowing Club.",
});

const isPinnedDiscriminator = (item: SafetyResponse) =>
  item.pin || containsUrgentWords(item.title);

const Safety = async () => {
  const safetyItems = fork(await fetchSafety(), isPinnedDiscriminator).flat();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {safetyItems.map((item) => (
        <SafetyItemCard key={item._id} {...item} />
      ))}
    </div>
  );
};

export default Safety;
