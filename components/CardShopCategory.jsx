import React from "react";

import { menProducts } from "../data/men";
import { womenProducts } from "../data/women";
import { kidsProducts } from "../data/kids";
import CardforCategory from "./CardforCategory";

const CardShopCategory = () => {
    const data = [
    { ...menProducts[5], name: "Men's Apparel" },
    { ...womenProducts[1], name: "Women's Fashion" },
    { ...kidsProducts[0], name: "Kids' wear" },
  ];
  return (
    <div className="flex flex-wrap justify-between overflow-hidden">
      {data.map((item) => <CardforCategory key={item.id} item={item} />)}
    </div>
  );
};

export default CardShopCategory;
