"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({Name,url}) => {

  const pathName = usePathname();
  const isActive = pathName.startsWith(url);
  return (
    <li
      className={`pb-1 transition-all ${
        isActive
          ? "border-b-2 border-b-blue-400 font-semibold"
          : ""
      }`}
    >
      <Link href={url}>{Name}</Link>
    </li>
  );
};

export default NavLink;
