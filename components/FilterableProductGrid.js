"use client";

import React, { useState, useMemo } from "react";
import Card from "./Card";
import ProductFilterBar from "./ProductFilterBar";

export default function FilterableProductGrid({ products, title }) {
  const [sortOption, setSortOption] = useState("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, sortOption]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {title && (
          <h1 className="text-3xl font-bold">{title}</h1>
        )}
        <ProductFilterBar sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sortedProducts.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
