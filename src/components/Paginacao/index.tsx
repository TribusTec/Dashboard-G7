import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
    PaginationEllipsis
  } from "@/components/ui/pagination";
  
  interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const CustomPagination: React.FC<CustomPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
  }) => {
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
            lang="pt-BR"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
            >
   
            </PaginationPrevious>
          </PaginationItem>
  
          {Array.from({length: totalPages}, (_, i) => i).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page + 1);
                }}
                isActive={currentPage === page + 1}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
  
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
  
          <PaginationItem>
            <PaginationNext
              lang="pt-BR"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
            >
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };  
  export default CustomPagination;
  