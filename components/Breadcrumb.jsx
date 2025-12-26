"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-black">
        Home
      </Link>

      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");

        return (
          <span key={index}>
            <span className="mx-2">/</span>
            <Link href={href} className="hover:text-black capitalize">
              {path.replace("-", " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
