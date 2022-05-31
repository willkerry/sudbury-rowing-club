import cn from "classnames";
import Label from "@/components/stour/label";
import DateFormatter from "@/components/utils/date-formatter";

type Props = {
  title: string;
  date: string;
  center?: boolean;
};

const PostTitle = ({ title, date, center }: Props) => (
  <div className={cn("max-w-2xl mx-auto my-12", center && "text-center")}>
    <Label>
      <DateFormatter dateString={date} />
    </Label>
    <h1 className="mt-2 mb-10 text-3xl font-semibold leading-tight tracking-tighter text-gray-800 md:text-5xl lg:text-6xl md:leading-none">
      {title}
    </h1>
  </div>
);

export default PostTitle;
