"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

const Card = ({ item }) => {
  return (
    <div className="relative group">
      <Link href={`/products/${item.id}`}>
        <div className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-xl p-4">
          <div className="relative h-75 w-full rounded-xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              loading="eager"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          <h4 className="font-medium text-gray-900 mt-2">{item.name}</h4>
          <p className="text-sm text-gray-500 ">{item.category}</p>
          <p className=" font-bold text-gray-800 ">${item.price}</p>
        </div>
      </Link>
      {/* Add to Cart overlay button */}
      <div className="absolute bottom-20 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AddToCartButton product={item} variant="compact" />
      </div>
    </div>
  );
};

export default Card;
