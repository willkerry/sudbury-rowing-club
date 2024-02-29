import Link from "next/link";
import cn from "clsx";
import { Button } from "@/components/ui/button";

const L2RCallToAction = () => {
  const classes =
    "flex items-center justify-between gap-4 p-6 border shadow rounded";
  return (
    <div className="my-20 grid gap-6 text-gray-700 sm:my-36 sm:gap-12 md:grid-cols-2">
      <div className={cn("border-green-300 bg-green-50", classes)}>
        Send your application form now
        <Button asChild variant="success">
          <Link href="/join/apply">Apply</Link>
        </Button>
      </div>
      <div className={cn("border-gray-300 bg-gray-50", classes)}>
        <span className="tracking-snug">
          Contact the Learn to Row coordinator
        </span>
        <Button asChild>
          <Link href="/join/contact">Contact</Link>
        </Button>
      </div>
    </div>
  );
};

export default L2RCallToAction;
