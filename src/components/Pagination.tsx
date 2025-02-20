import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination.tsx"

type PaginationProps = {
    pageNumber: number;
    totalPages: number;
    setPageNumber: (page: number) => void;
}

export default function PaginationComponent({pageNumber, totalPages, setPageNumber}: PaginationProps) {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setPageNumber(page - 1);
        }
    }

    return (
        <Pagination className='flex flex-wrap justify-start mb-4 mt-2'>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange(pageNumber - 1)}/>
                </PaginationItem>

                {Array.from({length: totalPages}, (_, i) => (
                    <PaginationItem key={i + 1}>
                        <PaginationLink
                            className='cursor-pointer'
                            onClick={() => handlePageChange(i + 1)}
                            isActive={i + 1 === pageNumber}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {totalPages > 3 && <PaginationEllipsis/>}

                <PaginationItem>
                    <PaginationNext className='cursor-pointer' onClick={() => handlePageChange(pageNumber + 1)}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}