import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";
import cn from "clsx";

type Props = {
  title: string;
  date: string;
  center?: boolean;
};

const PostTitle = ({ title, date, center }: Props) => (
  <div className={cn("mx-auto my-12 max-w-2xl", center && "text-center")}>
    <Label>
      <DateFormatter dateString={date} />
    </Label>
    <h1 className="mt-2 mb-10 text-balance font-bold text-3xl text-gray-800 leading-tight md:text-5xl md:leading-none lg:text-6xl">
      {title}
    </h1>
  </div>
);

export default PostTitle;
