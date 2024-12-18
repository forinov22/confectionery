import styles from "./Pagination.module.css";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  windowSize: number;
  search?: string;
  category?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  windowSize,
  search = "",
  category = "",
}: PaginationProps) => {
  // Calculate the range of page numbers to display based on windowSize
  const startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const endPage = Math.min(
    totalPages,
    currentPage + Math.floor(windowSize / 2),
  );

  // Helper to build the query string for links
  const buildQuery = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    params.append("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      {/* Previous Button */}
      <button
        className={`${styles["prev-next-button"]} ${
          currentPage == 1 ? styles.disabled : ""
        }`}
      >
        <Link
          href={buildQuery(currentPage - 1)}
          className={styles["page-link"]}
          style={{
            pointerEvents: currentPage == 1 ? 'none' : 'auto'
          }}
        >
          Previous
        </Link>
      </button>

      {/* Page Numbers */}
      {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
        const page = startPage + idx;
        return (
          <li
            key={page}
            className={`${styles["page-item"]} ${
              page == currentPage ? styles.active : ""
            }`}
          >
            <Link href={buildQuery(page)} className={styles["page-link"]}>
              {page}
            </Link>
          </li>
        );
      })}

      {/* Next Button */}
      <button
        className={`${styles["prev-next-button"]} ${
          currentPage == totalPages ? styles.disabled : ""
        }`}
      >
        <Link
          href={buildQuery(+currentPage + 1)}
          className={styles["page-link"]}
          style={{
            pointerEvents: currentPage == totalPages ? 'none' : 'auto'
          }}
        >
          Next
        </Link>
      </button>
    </div>
  );
};

export default Pagination;
