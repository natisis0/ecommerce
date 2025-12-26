
import { allProducts } from "./allProduct";

export const kidsProducts = allProducts.filter(
  (product) => product.gender === "Kids"
);

// The resulting array will contain products 25 through 36.
