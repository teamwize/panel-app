import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationProps = {
    totalContents: number;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize: number;
}

export default function PaginationComponent({totalContents, pageNumber, setPageNumber, pageSize}: PaginationProps) {
    const totalPages: number = Math.ceil(totalContents / pageSize);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setPageNumber(page);
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(pageNumber - 1)}/>
                </PaginationItem>

                {Array.from({length: totalPages}, (_, i) => (
                    <PaginationItem key={i + 1}>
                        <PaginationLink
                            onClick={() => handlePageChange(i + 1)}
                            isActive={i + 1 === pageNumber}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {totalPages > 3 && <PaginationEllipsis/>}

                <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(pageNumber + 1)}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}