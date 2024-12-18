import CartClient from "@/app/ui/cart/CartClient"; // Your client component
import { getCart } from "../lib/api";

const CartPage = async () => {
  const cartResponse = await getCart();

  if (cartResponse.success) {
    return <CartClient initialCart={cartResponse.data} />;
  }

  return <div>Cart not found</div>;
};

export default CartPage;
