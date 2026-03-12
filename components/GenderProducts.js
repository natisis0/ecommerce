import { getProductsByGender } from "@/_lib/data-service";
import FilterableProductGrid from "./FilterableProductGrid";

export default async function GenderProducts({ gender, title }) {
  const products = (await getProductsByGender(gender)) || [];

  return <FilterableProductGrid products={products} title={title} />;
}
