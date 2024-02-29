import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  showPrev: boolean;
  showNext: boolean;
  previous: string;
  next: string;
};

const Paginate = ({ showPrev, showNext, previous, next }: Props) => (
  <div className="my-10 flex items-center justify-between gap-4">
    <div>
      {showPrev && (
        <Button asChild>
          <Link href={previous}>
            <ArrowLeftIcon aria-hidden className="w-4 mr-2" /> Newer
          </Link>
        </Button>
      )}
    </div>
    <div>
      {showNext && (
        <Button asChild>
          <Link href={next}>
            Older
            <ArrowRightIcon aria-hidden className="w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  </div>
);

export default Paginate;
