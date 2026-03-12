"use client";

import React from "react";

const SORT_OPTIONS = [
  { label: "Newest", value: "default" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name: A → Z", value: "name-asc" },
  { label: "Name: Z → A", value: "name-desc" },
];

export default function ProductFilterBar({ sortOption, onSortChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 font-medium">Sort by:</span>
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-all duration-200 min-w-40 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 focus:outline-none hover:border-gray-300 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
