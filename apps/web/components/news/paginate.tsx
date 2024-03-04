import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  pages: number;
  showPrev: boolean;
  showNext: boolean;
  previous: string;
  next: string;
};

const Paginate = ({
  page,
  pages,
  showPrev,
  showNext,
  previous,
  next,
}: Props) => (
  <Pagination className="my-12">
    <PaginationContent>
      {showPrev && (
        <PaginationItem>
          <PaginationPrevious href={previous} aria-disabled={!showPrev} />
        </PaginationItem>
      )}

      {page - 1 > 1 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {showPrev && (
        <PaginationItem>
          <PaginationLink href={`/news/p/${page - 1}`}>
            {page - 1}
          </PaginationLink>
        </PaginationItem>
      )}

      <PaginationItem>
        <PaginationLink isActive href={`/news/p/${page}`}>
          {page}
        </PaginationLink>
      </PaginationItem>

      {showNext && (
        <PaginationItem>
          <PaginationLink href={`/news/p/${page + 1}`}>
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {page + 1 < pages && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {showNext && (
        <PaginationItem>
          <PaginationNext href={next} aria-disabled={!showNext} />
        </PaginationItem>
      )}
    </PaginationContent>
  </Pagination>
);

export default Paginate;
