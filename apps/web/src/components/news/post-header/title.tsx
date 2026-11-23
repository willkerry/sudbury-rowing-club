import { Label } from "@/components/stour/label";
import { DateFormatter } from "@/components/utils/date-formatter";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  date: string;
  center?: boolean;
};

export const PostTitle = ({ title, date, center }: Props) => (
  <div className={cn("mx-auto my-12 max-w-2xl", center && "text-center")}>
    <Label>
      <DateFormatter dateString={date} />
    </Label>
    <h1 className="mt-2 mb-10 text-3xl leading-tight font-bold text-balance text-gray-800 md:text-5xl md:leading-none lg:text-6xl">
      {title}
    </h1>
  </div>
);
