"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { User, Menu, X } from "lucide-react";
import { storeActions } from "../../store/CartStore";

import icon from "../../public/images/icon.png";
import cart from "../../public/images/cart_icon.png";

import NavLink from "./NavLink";
import SearchBox from "./SearchBox";
import { createClient } from "@/_lib/supabase-browser";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize cart from localStorage
    dispatch(storeActions.initializeCart());
  }, [dispatch]);

  // Merge localStorage cart into DB and sync
  const mergeAndSyncCart = React.useCallback(async (authUser) => {
    try {
      dispatch(storeActions.setSyncing(true));
      // Get localStorage items
      const stored = localStorage.getItem("cart_items");
      const localItems = stored ? JSON.parse(stored) : [];

      if (localItems.length > 0) {
        // Merge into DB
        const res = await fetch("/api/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: localItems.map((item) => ({
              productId: item.id,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        });

        if (res.ok) {
          const { items } = await res.json();
          // Transform DB items to Redux format
          const reduxItems = items.map((dbItem) => ({
            id: dbItem.product_id,
            name: dbItem.products?.name || "",
            price: Number(dbItem.price),
            image: dbItem.products?.image || "",
            category: dbItem.products?.category || "",
            quantity: dbItem.quantity,
          }));
          dispatch(storeActions.setCart(reduxItems));
          // Clear localStorage since items are now in DB
          localStorage.removeItem("cart_items");
          return;
        }
      }

      // If no local items to merge, just fetch from DB
      const res = await fetch("/api/cart");
      if (res.ok) {
        const { items } = await res.json();
        const reduxItems = items.map((dbItem) => ({
          id: dbItem.product_id,
          name: dbItem.products?.name || "",
          price: Number(dbItem.price),
          image: dbItem.products?.image || "",
          category: dbItem.products?.category || "",
          quantity: dbItem.quantity,
        }));
        dispatch(storeActions.setCart(reduxItems));
        localStorage.removeItem("cart_items");
      }
    } catch (error) {
      console.error("Cart merge/sync failed:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch avatar from profiles table
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();
        if (profile?.avatar_url) {
          setProfileAvatar(profile.avatar_url);
        }

        // If user is logged in, merge localStorage cart into DB
        await mergeAndSyncCart(user);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfileAvatar(null);
        // User logged out — re-initialize from localStorage
        dispatch(storeActions.initializeCart());
      } else if (_event === "SIGNED_IN") {
        // User just logged in — merge localStorage cart into DB
        await mergeAndSyncCart(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, mergeAndSyncCart]);

  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const avatarUrl =
    profileAvatar ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  return (
    <nav className="relative flex justify-between items-center p-3 shadow-sm shadow-gray-300">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-center">
        <Image
          src={icon}
          alt="icon"
          width={40}
          height={40}
          style={{ width: "auto", height: "auto" }}
        />
        <h3 className="font-semibold text-semibold">NextGen</h3>
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-center gap-6">
        <NavLink Name="Men" url="/men" />
        <NavLink Name="Women" url="/women" />
        <NavLink Name="Kids" url="/kids" />
        <NavLink Name="All Products" url="/allproducts" />
      </ul>

      {/* Desktop Right Icons + Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <React.Suspense fallback={<div className="w-9 h-9" />}>
          <SearchBox />
        </React.Suspense>

        {/* Account Icon (always visible) */}
        <Link
          href={user ? "/account" : "/login"}
          className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-400 transition-colors flex items-center justify-center bg-gray-100"
        >
          {user && avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-500" />
          )}
        </Link>

        {/* Cart (always visible) */}
        <Link href="/cart" className="relative">
          <Image
            src={cart}
            alt="cart"
            width={30}
            height={30}
            style={{ width: "auto", height: "auto" }}
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>

        {/* Hamburger Button (mobile only) */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100">
            <React.Suspense fallback={<div className="h-9" />}>
              <SearchBox />
            </React.Suspense>
          </div>
          <ul className="flex flex-col p-4 gap-1">
            {[
              { name: "Men", url: "/men" },
              { name: "Women", url: "/women" },
              { name: "Kids", url: "/kids" },
              { name: "All Products", url: "/allproducts" },
            ].map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
