"use server";

import { getCurrentUser } from "./auth";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./data-service";
import { revalidatePath } from "next/cache";

export async function createAddressAction(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const country = formData.get("country");
  const city = formData.get("city");
  const state = formData.get("state");
  const postalCode = formData.get("postal_code");
  const addressLine1 = formData.get("address_line1");
  const addressLine2 = formData.get("address_line2");
  const isDefault = formData.get("is_default") === "on";

  // Validation
  if (!fullName || !phone || !country || !city || !addressLine1) {
    return { error: "Please fill in all required fields." };
  }

  try {
    await createAddress({
      user_id: user.id,
      full_name: fullName,
      phone,
      country,
      city,
      state: state || null,
      postal_code: postalCode || null,
      address_line1: addressLine1,
      address_line2: addressLine2 || null,
      is_default: isDefault,
    });
  } catch (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  return { success: true };
}

export async function updateAddressAction(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const addressId = formData.get("address_id");
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const country = formData.get("country");
  const city = formData.get("city");
  const state = formData.get("state");
  const postalCode = formData.get("postal_code");
  const addressLine1 = formData.get("address_line1");
  const addressLine2 = formData.get("address_line2");
  const isDefault = formData.get("is_default") === "on";

  if (!fullName || !phone || !country || !city || !addressLine1) {
    return { error: "Please fill in all required fields." };
  }

  try {
    await updateAddress(addressId, {
      full_name: fullName,
      phone,
      country,
      city,
      state: state || null,
      postal_code: postalCode || null,
      address_line1: addressLine1,
      address_line2: addressLine2 || null,
      is_default: isDefault,
    });
  } catch (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  return { success: true };
}

export async function deleteAddressAction(addressId) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    await deleteAddress(addressId);
  } catch (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  return { success: true };
}

export async function setDefaultAddressAction(addressId) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    await setDefaultAddress(user.id, addressId);
  } catch (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  return { success: true };
}
