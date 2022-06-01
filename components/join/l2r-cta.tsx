import Button from "@/components/stour/button";
import Link from "@/components/stour/link";
import cn from "classnames";

const L2RCallToAction = () => {
  const classes =
    "flex items-center justify-between gap-4 p-6 border shadow rounded";
  return (
    <div className="grid gap-6 my-20 text-gray-700 sm:gap-12 md:grid-cols-2 sm:my-36">
      <div className={cn("border-green-300 bg-green-50", classes)}>
        Send your application form now
        <Button as={Link} href="/join/apply" variant="success">
          Apply
        </Button>
      </div>
      <div className={cn("border-gray-300 bg-gray-50", classes)}>
        <span className="tracking-snug">
          Contact the Learn to Row coordinator
        </span>
        <Button as={Link} href="/contact">
          Contact
        </Button>
      </div>
    </div>
  );
};

export default L2RCallToAction;
