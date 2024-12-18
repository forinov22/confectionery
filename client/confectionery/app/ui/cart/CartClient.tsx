"use client";

import { useState, useCallback } from "react";
import styles from "./CartClient.module.scss";
import { useRouter } from "next/navigation";
import { Cart } from "@/app/lib/definitions";
import { createOrder, updateCartItemQuantity } from "@/app/lib/api";
import { debounce } from "@/app/lib/utils";

type CartClientProps = {
  initialCart: Cart;
};

const CartClient: React.FC<CartClientProps> = ({ initialCart }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const router = useRouter();

  const updateCartOnServer = useCallback(
    async (confectionery_id: number, new_quantity: number) => {
      const response = await updateCartItemQuantity(
        confectionery_id,
        new_quantity,
      );

      if (!response.success) {
        console.log("Failed to update cart on the server");
      }
    },
    [],
  );

  const debouncedUpdateCart = useCallback(
    debounce((confectionery_id: number, new_quantity: number) => {
      updateCartOnServer(confectionery_id, new_quantity);
    }, 1000),
    [],
  );

  const handleQuantityChange = (confectionery_id: number, quantity: number) => {
    if (confectionery_id === null) return;

    setCart((prevCart) => {
      let total_items_count = 0;
      let total_price = 0;

      const cart_items = prevCart.cart_items.map((item) => {
        const confectionery_quantity =
          item.confectionery_id === confectionery_id
            ? Math.max(quantity, 1)
            : item.confectionery_quantity;

        total_items_count += confectionery_quantity;
        total_price += confectionery_quantity * item.confectionery_price;

        return {
          ...item,
          confectionery_quantity: confectionery_quantity,
        };
      });

      const newCart = {
        ...prevCart,
        total_items_count,
        total_price: total_price,
        cart_items,
      };

      debouncedUpdateCart(confectionery_id, Math.max(quantity, 1)); // Send only the updated quantity to server

      return newCart;
    });
  };

  const handleCheckout = async () => {
    const response = await createOrder();

    if (response.success) {
      router.replace("/orders");
    }
  };

  if (cart.total_items_count === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className={styles.cart}>
      <h1>Your Cart</h1>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.cart_items.map((item, index) => (
            <tr key={index}>
              <td>{`${item.confectionery_name}`}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.confectionery_quantity || 1}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.confectionery_id,
                      Number(e.target.value),
                    )
                  }
                  className={styles.quantityInput}
                />
              </td>
              <td>
                $
                {item.confectionery_price! * (item.confectionery_quantity || 1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.cartSummary}>
        <h2>Total: ${cart.total_price}</h2>
        <button onClick={handleCheckout} className={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartClient;
