export default function Pagination({ data, currentPage, setCurrentPage, recordsPerPage }) {
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <nav className="flex items-center justify-between pb-3" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm">
          Showing <span className="font-medium">{Math.min(firstIndex + 1, data.length)}</span> to{' '}
          <span className="font-medium">{Math.min(firstIndex + recordsPerPage, data.length)}</span> of{' '}
          <span className="font-medium">{data.length}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <a onClick={prevPage} href="#" className={`relative inline-flex items-center rounded-md p-2 text-sm font-semibold ring-1 ring-inset ring-gray-200 dark:ring-gray-800 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-indigo-200 dark:hover:bg-indigo-700 hover:bg-opacity-75 focus-visible:outline-offset-0'}`}>Previous</a>
        <a onClick={nextPage} href="#" className={`relative ml-3 inline-flex items-center rounded-md p-2 text-sm font-semibold ring-1 ring-inset ring-gray-200 dark:ring-gray-800 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-indigo-200 dark:hover:bg-indigo-700 hover:bg-opacity-75 focus-visible:outline-offset-0'}`}>Next</a>
      </div>
    </nav>
  )
}