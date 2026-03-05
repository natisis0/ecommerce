"use client";


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeActions } from "../../../store/CartStore";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/_lib/supabase-browser";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loadingItem, setLoadingItem] = useState(null);
  const [mounted, setMounted] = useState(false);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const estimatedTax = totalAmount * 0.08;
  const finalTotal = totalAmount + estimatedTax;

  const syncToDb = async (method, body) => {
    try {
      const res = await fetch("/api/cart", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok && res.status !== 401) {
        console.error("Cart sync failed");
      }
    } catch {
      // Silently fail
    }
  };

  const handleIncrement = async (item) => {
    setLoadingItem(item.id);
    dispatch(storeActions.addToCart(item));
    await syncToDb("PATCH", {
      productId: item.id,
      quantity: item.quantity + 1,
    });
    setLoadingItem(null);
  };

  const handleDecrement = async (item) => {
    setLoadingItem(item.id);
    if (item.quantity <= 1) {
      dispatch(storeActions.deleteItem(item));
      await syncToDb("DELETE", { productId: item.id });
    } else {
      dispatch(storeActions.removeFromCart(item));
      await syncToDb("PATCH", {
        productId: item.id,
        quantity: item.quantity - 1,
      });
    }
    setLoadingItem(null);
  };

  const handleDelete = async (item) => {
    setLoadingItem(item.id);
    dispatch(storeActions.deleteItem(item));
    await syncToDb("DELETE", { productId: item.id });
    toast.success(`${item.name} removed from cart`);
    setLoadingItem(null);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to proceed to checkout");
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-gray-50 rounded-full p-8 mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Discover
          our collection and find something you love!
        </p>
        <Link
          href="/allproducts"
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[95%] max-w-7xl mx-auto py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link
          href="/allproducts"
          className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors underline underline-offset-4 decoration-dotted"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 md:gap-6 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
                loadingItem === item.id ? "opacity-60" : ""
              }`}
            >
              {/* Product Image */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.category}</p>
                <p className="text-lg font-extrabold text-gray-900 mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => handleDecrement(item)}
                  disabled={loadingItem === item.id}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <Minus className="w-3.5 h-3.5 text-gray-700" />
                </button>
                <span className="w-10 text-center font-bold text-gray-900 text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleIncrement(item)}
                  disabled={loadingItem === item.id}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5 text-gray-700" />
                </button>
              </div>

              {/* Line Total */}
              <div className="text-right min-w-[70px] hidden sm:block">
                <p className="font-extrabold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item)}
                disabled={loadingItem === item.id}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                title="Remove item"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Tax</span>
                <span className="font-bold text-gray-900">
                  ${estimatedTax.toFixed(2)}
                </span>
              </div>
            </div>

            <hr className="my-5 border-gray-100" />

            <div className="flex justify-between mb-6">
              <span className="text-lg font-extrabold text-gray-900">
                Total
              </span>
              <span className="text-lg font-extrabold text-gray-900">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {user ? (
              <Link
                href="/checkout"
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={handleCheckout}
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Log in to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}

            {/* Trust Badges */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Secure SSL checkout</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <RotateCcw className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
