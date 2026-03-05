"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { User } from "lucide-react";
import { storeActions } from "../../store/CartStore";

import icon from "../../public/images/icon.png";
import cart from "../../public/images/cart_icon.png";

import NavLink from "./NavLink";
import { createClient } from "@/_lib/supabase-browser";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profileAvatar, setProfileAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize cart from localStorage
    dispatch(storeActions.initializeCart());
  }, [dispatch]);

  // Merge localStorage cart into DB and sync
  const mergeAndSyncCart = async (authUser) => {
    try {
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
  };

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
  }, [dispatch]);

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
    <nav className="flex justify-between items-center p-3 shadow-sm shadow-gray-300 flex-wrap">
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
      <ul className="flex items-center md:gap-6 flex-wrap gap-1">
        <NavLink Name="Men" url="/men" />
        <NavLink Name="Women" url="/women" />
        <NavLink Name="Kids" url="/kids" />
        <NavLink Name="All Products" url="/allproducts" />
      </ul>
      <div className="flex p-2 items-center gap-3">
        {/* Account Icon */}
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

        {/* Cart */}
        <Link href="/cart" className="relative">
          <Image
            src={cart}
            alt="cart"
            width={30}
            height={30}
            style={{ width: "auto", height: "auto" }}
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
