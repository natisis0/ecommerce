"use server";

import { stripe } from "./stripe";
import { getCurrentUser } from "./auth";
import { getOrdersByUserId, updateOrder } from "./data-service";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession(orderId) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to make a payment.");

    // 1. Fetch the order to ensure it belongs to the user and gets its total price
    const orders = await getOrdersByUserId(user.id);
    const order = orders.find((o) => o.id === orderId);

    if (!order) throw new Error("Order not found");
    if (order.payment_status === "paid") throw new Error("Order is already paid");

    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // 2. Map order items to Stripe line items
    const line_items = order.order_items?.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.products?.name || `Product #${item.product_id}`,
          images: item.products?.image ? [item.products.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Fallback if no items (shouldn't happen with valid orders)
    const finalLineItems =
      line_items && line_items.length > 0
        ? line_items
        : [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Order #${order.id}`,
                },
                unit_amount: Math.round(order.total_price * 100),
              },
              quantity: 1,
            },
          ];

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: finalLineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel/${orderId}`,
      metadata: {
        orderId: orderId.toString(),
        userId: user.id.toString(),
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Error:", error);
    return { error: error.message || "Failed to create checkout session" };
  }
}

export async function finalizeOrderAction(orderId, sessionId) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not verified");
    }

    // 2. Update the order
    await updateOrder(orderId, {
      payment_status: "paid",
      status: "processing",
    });

    revalidatePath("/account/orders");
    return { success: true };
  } catch (error) {
    console.error("Finalize Order Error:", error);
    return { error: error.message || "Failed to finalize order" };
  }
}
