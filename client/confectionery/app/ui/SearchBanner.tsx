import styles from "./SearchBanner.module.scss";

export default function SearchBanner() {
  return (
    <div className={styles["search-banner"]}>
      <form method="GET" action="/" className={styles["search-form"]}>
        <input
          type="text"
          name="search"
          placeholder="Search confectioneries..."
          className={styles["search-input"]}
        />
        <button type="submit" className={styles["search-button"]}>
          Search
        </button>
      </form>
    </div>
  );
}
