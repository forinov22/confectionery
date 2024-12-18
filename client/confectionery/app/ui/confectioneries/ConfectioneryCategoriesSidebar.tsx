import Link from "next/link";
import styles from "./ConfectioneryCategoriesSidebar.module.scss";
import { ConfectioneryCategory } from "@/app/lib/definitions";

export default async function ConfectioneryCategoriesSidebar({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  const response = await fetch(
    `${process.env.API_URL}/api/confectioneryCategories`,
  );
  const confectioneryCategories: ConfectioneryCategory[] =
    await response.json();

  return (
    <div className={styles.sidebar}>
      {confectioneryCategories.map((category) => (
        <Link
          key={category.id}
          href={`/?category=${category.name}`}
          style={{
            backgroundColor:
              currentCategory === category.name ? "#ff4b4b" : "#ff6b6b",
          }}
        >
          {category.name}
        </Link>
      ))}
      <Link
        href="/"
        style={{ backgroundColor: currentCategory ? "#ff6b6b" : "#ff4b4b" }}
      >
        All
      </Link>
    </div>
  );
}

