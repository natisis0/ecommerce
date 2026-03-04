import { supabase } from "./supabase";
import { cache } from "react";

// cache() deduplicates this call within a single server request
// So if Men, Women, Kids pages all call this, Supabase is only hit once per request
export const getAllProducts = cache(async function () {
  const { data, error } = await supabase.from("products").select();
  if (error) console.log(error.message);
  return data;
});

export const getProductsByGender = cache(async function (gender) {
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("gender", gender);
  if (error) console.log(error.message);
  return data;
});

export const getProductById = cache(async function (id) {
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("id", id)
    .single();
  if (error) console.log(error.message);
  return data;
});


export const getCategoryCards = cache(async function () {
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
