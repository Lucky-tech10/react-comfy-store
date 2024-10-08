import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

const PaginationContainer = () => {
  const { meta } = useLoaderData();
  const { pageCount, page } = meta.pagination;
  const pages = Array.from({ length: pageCount }, (_, index) => {
    return index + 1;
  });
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  if (pageCount < 2) return null;

  return (
    <div className="mt-16 flex justify-end">
      <div className="join">
        <button
          className={`btn btn-xs sm:btn-md join-item ${
            page === 1 && "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={() => {
            // let prevPage = page - 1;
            // if (prevPage < 1) prevPage = 1;
            handlePageChange(page - 1);
          }}
          disabled={page === 1}
        >
          Prev
        </button>
        {pages.map((pageNumber) => {
          return (
            <button
              onClick={() => handlePageChange(pageNumber)}
              key={pageNumber}
              className={`btn btn-xs sm:btn-md border-none join-item ${
                pageNumber === page && "bg-base-300 border-base-300"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className={`btn btn-xs sm:btn-md join-item ${
            page === pageCount && "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={() => {
            // let nextPage = page + 1;
            // if (nextPage > pageCount) return;
            handlePageChange(page + 1);
          }}
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationContainer;
