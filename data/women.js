
import { allProducts } from "./allProduct";

export const womenProducts = allProducts.filter(
  (product) => product.gender === "Women"
);

// The resulting array will contain products 1 through 12.
