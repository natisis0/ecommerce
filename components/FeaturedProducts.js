import { getAllProducts } from "@/_lib/data-service";
import getShuffledProducts from "@/_utils/shuffleProducts";
import MapProducts from "./MapProducts";

export default async function FeaturedProducts() {
  const allProducts = (await getAllProducts()) || [];
  const featured = getShuffledProducts(allProducts).slice(0, 4);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <MapProducts products={featured} />
    </div>
  );
}
