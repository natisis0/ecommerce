import { getAllProducts } from "@/_lib/data-service";
import getShuffledProducts from "@/_utils/shuffleProducts";
import FilterableProductGrid from "./FilterableProductGrid";

export default async function Allproducts({ title }) {
  const products = (await getAllProducts()) || [];
  const shuffledProducts = getShuffledProducts(products);

  return <FilterableProductGrid products={shuffledProducts} title={title} />;
}
