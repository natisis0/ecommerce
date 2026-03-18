import { Suspense } from "react";
import { getAllProducts } from "@/_lib/data-service";
import { createClient } from "@/_lib/supabase-server";
import { createEmbedding } from "@/_lib/ai/embedding";
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
  // If no query, show all products
  if (!query) {
    const products = (await getAllProducts()) || [];
    return <FilterableProductGrid products={products} title="All Products" />;
  }

  // Semantic search using embeddings
  const embedding = await createEmbedding(query);
  const supabase = await createClient();

  const { data: products, error } = await supabase.rpc("match_products", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 20,
  });

  if (error) {
    console.error("Semantic search error:", error.message);

    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">
          No results for &quot;{query}&quot;
        </h2>
        <p className="text-gray-500">
          We couldn&apos;t find any products matching your search. Try a
          different keyword.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">
          No results for &quot;{query}&quot;
        </h2>
        <p className="text-gray-500">
          We couldn&apos;t find any products matching your search. Try a
          different keyword.
        </p>
      </div>
    );
  }

  return (
    <FilterableProductGrid
      products={products}
      title={`Search results for "${query}"`}
    />
  );
}
