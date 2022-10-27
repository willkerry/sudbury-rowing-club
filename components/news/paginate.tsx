import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "../stour/button";

type Props = {
  page: number;
  showPrev: boolean;
  showNext: boolean;
  previous: string;
  next: string;
};

const Paginate = ({ showPrev, showNext, previous, next }: Props) => (
  <div className="flex items-center justify-between gap-4 my-10">
    <div>
      {showPrev && (
        <Link href={previous} passHref legacyBehavior>
          <Button asChild icon={<ArrowLeftIcon />}>
            Newer
          </Button>
        </Link>
      )}
    </div>
    <div>
      {showNext && (
        <Link href={next} passHref legacyBehavior>
          <Button asChild icon={<ArrowRightIcon />}>
            Older
          </Button>
        </Link>
      )}
    </div>
  </div>
);

export default Paginate;
