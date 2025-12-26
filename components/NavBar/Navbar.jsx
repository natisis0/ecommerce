import Image from "next/image";
import React from "react";
import Link from "next/link";

import icon from "../../public/images/icon.png";
import cart from "../../public/images/cart_icon.png";

import NavLink from "./NavLink";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-3 shadow-sm shadow-gray-300 flex-wrap">
      <div className="flex items-center gap-2 text-center">
        <Image src={icon} alt="icon" width={40} height={40} />
        <h3 className="font-semibold text-semibold">NextGen</h3>
      </div>
      <ul className="flex items-center md:gap-6 flex-wrap gap-1">
        <NavLink Name="Men" url="/men" />
        <NavLink Name="Women" url="/women" />
        <NavLink Name="Kids" url="/kids" />
        <NavLink Name="All Products" url="/allproducts" />
      </ul>
      <div className="flex p-2">
        <Link href="/cart">
          <Image src={cart} alt="cart" width={30} height={30} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
