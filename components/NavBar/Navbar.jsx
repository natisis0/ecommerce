"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import icon from "../../public/images/icon.png";
import cart from "../../public/images/cart_icon.png";

import NavLink from "./NavLink";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center p-3 shadow-sm shadow-gray-300 flex-wrap">
      <Link href="/" className="flex items-center gap-2 text-center">
        <Image src={icon} alt="icon" width={40} height={40} />
        <h3 className="font-semibold text-semibold">NextGen</h3>
      </Link>
      <ul className="flex items-center md:gap-6 flex-wrap gap-1">
        <NavLink Name="Men" url="/men" />
        <NavLink Name="Women" url="/women" />
        <NavLink Name="Kids" url="/kids" />
        <NavLink Name="All Products" url="/allproducts" />
      </ul>
      <div className="flex p-2 items-center">
        <Link href="/cart" className="relative">
          <Image src={cart} alt="cart" width={30} height={30} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
