"use server";

import { createClient } from "./supabase-server";

/**
 * Get all cart items for a user, joined with product info
 */
export async function getCartItems(userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id,
      product_id,
      quantity,
      price,
      added_at,
      products (
        id,
        name,
        image,
        category,
        gender,
        price
      )
    `,
    )
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart:", error.message);
    return [];
  }

  return data;
}

/**
 * Add item to cart — upsert: if exists, increment quantity
 */
export async function addCartItem(userId, productId, price, quantity = 1) {
  const supabase = await createClient();

  // Check if item already exists
  const { data: existing } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("cart")
      .insert({
        user_id: userId,
        product_id: productId,
        price,
        quantity,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

/**
 * Update cart item quantity directly
 */
export async function updateCartItemQuantity(userId, productId, quantity) {
  const supabase = await createClient();

  if (quantity <= 0) {
    return removeCartItem(userId, productId);
  }

  const { data, error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Remove a single item from cart
 */
export async function removeCartItem(userId, productId) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw new Error(error.message);
  return true;
}

/**
 * Clear entire cart for a user
 */
export async function clearCart(userId) {
  const supabase = await createClient();
  const { error } = await supabase.from("cart").delete().eq("user_id", userId);

  if (error) throw new Error(error.message);
  return true;
}

/**
 * Merge localStorage cart items into DB cart
 * For each item: if the product already exists in DB cart, take the higher quantity;
 * if it doesn't exist, insert it.
 */
export async function mergeCart(userId, localItems) {
  const supabase = await createClient();

  for (const item of localItems) {
    const { data: existing } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", item.productId)
      .single();

    if (existing) {
      // Take the max quantity between local and DB
      const newQty = Math.max(existing.quantity, item.quantity);
      await supabase
        .from("cart")
        .update({ quantity: newQty })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart").insert({
        user_id: userId,
        product_id: item.productId,
        price: item.price,
        quantity: item.quantity,
      });
    }
  }

  // Return the full merged cart
  return getCartItems(userId);
}
