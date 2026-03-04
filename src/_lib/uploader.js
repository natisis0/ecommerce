import { supabase } from "./supabase";

import { allProducts } from "../../data/allProduct";

export async function uploadProducts() {
  const { error } = await supabase.from("products").insert(allProducts);
  console.log("Products uploaded successfully")
  if (error) console.log(error.message);
}

