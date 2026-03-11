import Link from "next/link";
import React from "react";

const CardforCategory = ({ item }) => {
  return (
    <Link href={`/${item.gender.toLowerCase()}`}>
      <div className="relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-4xl">
        <img
          src={item.image}
          alt={item.name}
          className="w-full rounded-4xl object-cover h-48 sm:h-64 md:h-80"
        />
        <div className="absolute bottom-4 left-4">
          <h4 className="font-bold text-xl sm:text-2xl text-black">
            {item.name}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default CardforCategory;
