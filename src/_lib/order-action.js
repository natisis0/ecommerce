"use server";

import { getCurrentUser } from "./auth";
import { createOrder, createOrderItems } from "./data-service";
import { clearCart } from "./cart-service";
import { revalidatePath } from "next/cache";
import { deleteOrder } from "./data-service";

export async function createOrderAction(addressId, items, totalAmount) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to place an order.");

    // 1. Create the order
    const orderData = {
      user_id: user.id,
      address_id: addressId,
      total_price: totalAmount,
      status: "pending",
      payment_status: "pending",
    };

    const order = await createOrder(orderData);

    // 2. Create the order items
    const orderItemsData = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await createOrderItems(orderItemsData);

    // 3. Clear the user's cart in the database
    await clearCart(user.id);

    revalidatePath("/account/orders");

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: error.message || "Failed to create order" };
  }
}

export async function deleteOrderAction(orderId) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await deleteOrder(orderId, user.id);

    revalidatePath("/account/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { error: error.message || "Failed to delete order" };
  }
}
