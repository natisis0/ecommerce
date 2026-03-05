"use server";

import { getCurrentUser } from "./auth";
import { updateProfile } from "./data-service";
import { createClient } from "./supabase-server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const fullName = formData.get("full_name");
  const avatarFile = formData.get("avatar");
 

  const updates = {};

  if (fullName !== null && fullName !== undefined) {
    updates.full_name = fullName;
  }

  // Handle avatar upload if a file was provided
  if (avatarFile && avatarFile.size > 0) {
    const supabase = await createClient();

    // Create a unique filename inside the user's folder
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
    console.log(filePath);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.log(uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    updates.avatar_url = publicUrl;
    console.log(updates);
  }

  try {
    await updateProfile(user.id, updates);
  } catch (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}
