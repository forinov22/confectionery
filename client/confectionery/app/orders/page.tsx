import { cookies } from "next/headers";
import Link from "next/link";
import { Order } from "../lib/definitions";

// Order type based on API structure

// Server-side component to fetch all user orders
const OrdersPage = async () => {
  const cookie = cookies().get("connect.sid")?.value; // Get the user cookie

  const response = await fetch(`${process.env.API_URL}/api/orders/user`, {
    method: "GET",
    credentials: "include", // Ensures cookies are sent
    headers: {
      "Cache-Control": "no-store",
      Cookie: `connect.sid=${cookie}`, // Set the cookie explicitly if needed
    },
  }); // Replace with your actual API endpoint
  const orders: Order[] = await response.json();

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total Items</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/orders/${order.id}`}>{order.id}</Link>
              </td>
              <td>{order.order_status}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>{order.total_items_count}</td>
              <td>${order.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
