import { getProductsByGender } from "@/_lib/data-service";
import getShuffledProducts from "@/_utils/shuffleProducts";
import MapProducts from "./MapProducts";

export default async function YouMayAlsoLike({ currentProductId, gender }) {
  const products = (await getProductsByGender(gender)) || [];

  // Exclude current product, shuffle, and pick 4
  const suggestions = getShuffledProducts(
    products.filter((p) => p.id !== currentProductId)
  ).slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 whitespace-nowrap">
          You May Also Like
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <MapProducts products={suggestions} />
      </div>
    </section>
  );
}
