"use client";

import { Confectionery } from "@/app/lib/definitions";
import styles from "./ConfectioneryCard.module.scss";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/lib/api";

interface ConfectioneryCardProps {
  confectionery: Confectionery;
}

const ConfectioneryCard: React.FC<ConfectioneryCardProps> = ({
  confectionery,
}) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const response = await addToCart(confectionery.confectionery_id);

    if (response.success) {
      router.push("/cart");
    }
  };

  return (
    <div className={styles["product-card"]}>
      <Image
        src={`http://localhost:5000${confectionery.confectionery_image_url}`}
        width={200}
        height={200}
        alt="confectionery"
        className={styles["product-image"]}
      />
      <div className={styles["product-info"]}>
        <h2>{confectionery.confectionery_name}</h2>
        <p>{confectionery.confectionery_category_name}</p>
        <span className={styles["price"]}>
          {confectionery.confectionery_price} BYN
        </span>
      </div>
      <div className={styles["product-actions"]}>
        <button onClick={handleAddToCart}>Add To Cart</button>
      </div>
    </div>
  );
};

export default ConfectioneryCard;
