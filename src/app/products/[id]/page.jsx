
"use client";
import React from "react";
import { getProductById } from "../../../../data/allProduct";
import { useParams } from "next/navigation";


const Page = () => {
  const params = useParams();
  const { id } = params;
  
  
  const product = getProductById(id);
  


  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center mb-4">
            <span className="text-gray-700 mr-2">Category:</span>
            <span className="font-semibold">{product.category}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-gray-700 mr-2">Gender:</span>
            <span className="font-semibold">{product.gender}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-gray-700 mr-2">Dimensions:</span>
            <span className="font-semibold">{product.dimension}</span>
          </div>
          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;