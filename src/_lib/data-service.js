import { createClient } from "./supabase-server";
import { cache } from "react";

// cache() deduplicates this call within a single server request
// So if Men, Women, Kids pages all call this, Supabase is only hit once per request
export const getAllProducts = cache(async function () {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select();
  if (error) console.log(error.message);
  return data;
});

export const getProductsByGender = cache(async function (gender) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("gender", gender);
  if (error) console.log(error.message);
  return data;
});

export const getProductById = cache(async function (id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("id", id)
    .single();
  if (error) console.log(error.message);
  return data;
});

export const getCategoryCards = cache(async function () {
  const supabase = await createClient();
  const genders = ["Men", "Women", "Kids"];
  const labels = {
    Men: "Men's Apparel",
    Women: "Women's Fashion",
    Kids: "Kids' Wear",
  };

  const results = await Promise.all(
    genders.map(async (gender) => {
      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("gender", gender)
        .limit(1)
        .single();
      if (error) console.log(error.message);
      return data ? { ...data, name: labels[gender] } : null;
    }),
  );

  return results.filter(Boolean);
});

export const getProfile = cache(async function (userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) console.log(error.message);
  return data;
});

export async function updateProfile(userId, updates) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ─── Address functions ───────────────────────────────────────

export const getAddresses = cache(async function (userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) console.log(error.message);
  return data ?? [];
});

export async function createAddress(addressData) {
  const supabase = await createClient();

  // If this address is set as default, unset all others first
  if (addressData.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", addressData.user_id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert(addressData)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAddress(id, updates) {
  const supabase = await createClient();

  // If setting as default, unset all others first
  if (updates.is_default) {
    const { data: existing } = await supabase
      .from("addresses")
      .select("user_id")
      .eq("id", id)
      .single();
    if (existing) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", existing.user_id);
    }
  }

  const { data, error } = await supabase
    .from("addresses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAddress(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setDefaultAddress(userId, addressId) {
  const supabase = await createClient();

  // Unset all defaults for this user
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId);

  // Set the chosen one as default
  const { data, error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ─── Order functions ─────────────────────────────────────────

export const getOrdersByUserId = cache(async function (userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          image,
          price
        )
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return data ?? [];
});

export async function createOrder(orderData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createOrderItems(orderItemsData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_items")
    .insert(orderItemsData)
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteOrder(orderId, userId) {
  const supabase = await createClient();
  // Ensure the order belongs to the user and is pending
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .eq("payment_status", "pending")
    .select();

  if (error) throw new Error(error.message);

  if (!data || data.length === 0) {
    throw new Error("Order not found, or it is no longer pending.");
  }
}
