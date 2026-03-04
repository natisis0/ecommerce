import { getProductsByGender } from "@/_lib/data-service";
import MapProducts from "./MapProducts";

export default async function GenderProducts({ gender }) {
  const products = (await getProductsByGender(gender)) || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <MapProducts products={products} />
    </div>
  );
}
