import ConfectioneryCard from "./ui/confectioneries/ConfectioneryCard";
import ConfectioneryCategoriesSidebar from "./ui/confectioneries/ConfectioneryCategoriesSidebar";
import SearchBanner from "./ui/SearchBanner";
import styles from "./page.module.scss";
import { getConfectioneries } from "./lib/api";
import Pagination from "./ui/pagination/Pagination";

export type SearchParams = {
  page?: string;
  category?: string;
  search?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, category, search } = searchParams;

  const pagedDataResponse = await getConfectioneries(page, category, search);
  if (!pagedDataResponse.success) {
    return (
      <div>
        <h1>confectioneries not found</h1>
      </div>
    );
  }

  const pagedData = pagedDataResponse.data;

  return (
    <section>
      <div>
        <SearchBanner />
      </div>
      <div className={styles["product-section"]}>
        <ConfectioneryCategoriesSidebar currentCategory={category} />
        <div>
          <div className={styles["product-grid"]}>
            {pagedData.data.map((confectionery) => (
              <ConfectioneryCard
                key={confectionery.confectionery_id}
                confectionery={confectionery}
              />
            ))}
          </div>
          <Pagination
            currentPage={pagedData.pagination.currentPage}
            totalPages={pagedData.pagination.totalPages}
            windowSize={10}
            search={search}
            category={category}
          />
        </div>
      </div>
    </section>
  );
}
