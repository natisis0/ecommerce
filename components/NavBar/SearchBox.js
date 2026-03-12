"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync state with URL q parameter
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false); // Close on submit
    }
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative flex items-center">
      <form
        onSubmit={handleSearch}
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isOpen ? "w-40 sm:w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-400 rounded-full py-1.5 px-4 text-sm outline-none"
        />
      </form>

      <button
        onClick={toggleSearch}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Search"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Search className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default SearchBox;
