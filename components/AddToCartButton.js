"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { storeActions } from "../store/CartStore";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

export default function AddToCartButton({ product, variant = "full" }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      category: product.category,
    };

    // Add to Redux (and localStorage)
    dispatch(storeActions.addToCart(cartItem));

    // Try to sync with DB if user is authenticated
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          price: Number(product.price),
          quantity: 1,
        }),
      });

      // 401 means not logged in, that's fine — localStorage will handle it
      if (!res.ok && res.status !== 401) {
        console.error("Failed to sync cart to DB");
      }
    } catch {
      // Silently fail for network errors — localStorage is the fallback
    }

    setLoading(false);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);

    setTimeout(() => setAdded(false), 2000);
  };

  // Compact variant — small icon button for card overlays
  if (variant === "compact") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-gray-900 hover:bg-black text-white p-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50"
        title="Add to Cart"
      >
        {added ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )}
      </button>
    );
  }

  // Full variant — large button for product detail page
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex-[2] bg-gray-900 hover:bg-black text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
    >
      {added ? (
        <>
          <Check className="w-6 h-6 text-green-400" />
          <span className="text-lg">Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-6 h-6" />
          <span className="text-lg">
            {loading ? "Adding..." : "Add to Cart"}
          </span>
        </>
      )}
    </button>
  );
}
