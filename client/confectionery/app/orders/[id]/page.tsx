import { Order } from "@/app/lib/definitions";
import { cookies } from "next/headers";

// OrderItem type based on API structure

// Server-side component to fetch order details by ID
const OrderDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const cookie = cookies().get("connect.sid")?.value; // Get the user cookie

  const response = await fetch(`${process.env.API_URL}/api/orders/${id}`, {
    method: "GET",
    credentials: "include", // Ensures cookies are sent
    headers: {
      "Cache-Control": "no-store",
      Cookie: `connect.sid=${cookie}`, // Set the cookie explicitly if needed
    },
  }); // Replace with your actual API endpoint
  const order: Order = await response.json();
  console.log("order ---> ", order);

  if (!order) {
    return <div>Loading order details...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.order_status}</p>
      <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
      <p>Total Items: {order.total_items_count}</p>
      <p>Total Price: ${order.total_price}</p>

      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Confectionery ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item, index) => (
            <tr key={index}>
              <td>{item.confectionery_id}</td>
              <td>{item.confectionery_quantity}</td>
              <td>${item.confectionery_price}</td>
              <td>${item.item_total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
