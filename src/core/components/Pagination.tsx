type PaginationProps = {
    totalContents: number;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize: number;
}

export default function Pagination({totalContents, pageNumber, setPageNumber, pageSize}: PaginationProps) {
    const lastIndex: number = pageNumber * pageSize;
    const firstIndex: number = lastIndex - pageSize;
    const totalPages: number = Math.ceil(totalContents / pageSize);

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const nextPage = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    return (
        <nav className="flex items-center justify-between pb-3" aria-label="Pagination">
            <div className="hidden sm:block">
                <p className="text-sm">
                    <span className="font-medium">{Math.min(firstIndex + 1, totalContents)}</span>
                    {' '}-{' '}
                    <span className="font-medium">{Math.min(firstIndex + pageSize, totalContents)}</span>
                    {' '}of{' '}
                    <span className="font-medium">{totalContents}</span>
                    {' '}results
                </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
                <a onClick={prevPage} href="#"
                   className={`relative inline-flex items-center rounded-md p-2 text-sm font-semibold ring-1 ring-inset ring-gray-200 dark:ring-gray-800
        ${pageNumber === 1 ? 'pointer-events-none opacity-50' :
                       'hover:bg-indigo-200 dark:hover:bg-indigo-700 hover:bg-opacity-75 focus-visible:outline-offset-0'}`}>Previous</a>
                <a onClick={nextPage} href="#"
                   className={`relative ml-3 inline-flex items-center rounded-md p-2 text-sm font-semibold ring-1 ring-inset ring-gray-200 dark:ring-gray-800
        ${pageNumber === totalPages ? 'pointer-events-none opacity-50' :
                       'hover:bg-indigo-200 dark:hover:bg-indigo-700 hover:bg-opacity-75 focus-visible:outline-offset-0'}`}>Next</a>
            </div>
        </nav>
    )
}