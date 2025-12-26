import React from "react";
import Link from "next/link";


const Card = ({ item }) => {
  return (
    <Link href={`/products/${item.id}`}>
      <div className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-xl p-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-75 w-full rounded-xl object-cover"
        />
        <h4 className="font-medium text-gray-900 mt-2">{item.name}</h4>
        <p className="text-sm text-gray-500 ">{item.category}</p>
        <p className=" font-bold text-gray-800 ">${item.price}</p>
      </div>
    </Link>
  );
};

export default Card;
