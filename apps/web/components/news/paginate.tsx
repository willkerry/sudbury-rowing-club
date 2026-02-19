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
  template?: string;
};

export const Paginate = ({
  page,
  pages,
  showPrev,
  showNext,
  previous,
  next,
  template = "/news/p/",
}: Props) => (
  <Pagination className="my-12">
    <PaginationContent>
      {showPrev && (
        <PaginationItem>
          <PaginationPrevious aria-disabled={!showPrev} href={previous} />
        </PaginationItem>
      )}

      {page - 1 > 1 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {showPrev && (
        <PaginationItem>
          <PaginationLink href={`${template}${page - 1}`}>
            {page - 1}
          </PaginationLink>
        </PaginationItem>
      )}

      <PaginationItem>
        <PaginationLink href={`${template}${page}`} isActive>
          {page}
        </PaginationLink>
      </PaginationItem>

      {showNext && (
        <PaginationItem>
          <PaginationLink href={`${template}${page + 1}`}>
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {page + 1 < pages && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {page + 1 < pages && (
        <PaginationItem>
          <PaginationLink href={`${template}${pages}`}>{pages}</PaginationLink>
        </PaginationItem>
      )}

      {showNext && (
        <PaginationItem>
          <PaginationNext aria-disabled={!showNext} href={next} />
        </PaginationItem>
      )}
    </PaginationContent>
  </Pagination>
);
