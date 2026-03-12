import { Suspense } from "react";
import { getAllProducts } from "@/_lib/data-service";
import Breadcrumb from "../../../components/Breadcrumb";
import FilterableProductGrid from "../../../components/FilterableProductGrid";
import { SpinnerCustom } from "@/components/ui/spinner";

export const metadata = {
  title: "Search Results | Ecommerce",
};

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div className="mt-8">
        <Suspense fallback={<SpinnerCustom />}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}

async function SearchResults({ query }) {
  const products = (await getAllProducts()) || [];

  const filteredProducts = products.filter((product) => {
    const searchStr = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchStr) ||
      product.category.toLowerCase().includes(searchStr) ||
      product.gender.toLowerCase().includes(searchStr)
    );
  });

  return (
    <FilterableProductGrid
      products={filteredProducts}
      title={query ? `Search results for "${query}"` : "All Products"}
    />
  );
}
