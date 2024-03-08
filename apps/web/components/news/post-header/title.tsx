import cn from "clsx";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";

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
    <h1 className="mb-10 mt-2 text-3xl font-semibold leading-tight text-gray-800 md:text-5xl md:leading-none lg:text-6xl">
      {title}
    </h1>
  </div>
);

export default PostTitle;
