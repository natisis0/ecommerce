
import { allProducts } from "./allProduct";

export const menProducts = allProducts.filter(
  (product) => product.gender === "Men"
);

// The resulting array will contain products 13 through 24.
