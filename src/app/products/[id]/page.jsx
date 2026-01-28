
"use client";
import React, { useState } from "react";
import { getProductById } from "../../../../data/allProduct";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { storeActions } from "../../../../store/CartStore";

const Page = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </div>
    );
  }

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    setIsAdding(true);

    dispatch(storeActions.addToCart({ ...product, quantity }));
    console.log("Adding to cart:", product.name, "Quantity:", quantity);

    setTimeout(() => setIsAdding(false), 500); // Simulate network delay
  };

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

          <div className="flex items-center mb-6">
            <span className="text-gray-700 mr-4">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={handleDecrement}
                className="px-3 py-1 hover:bg-gray-100 border-r border-gray-300"
              >
                -
              </button>
              <span className="px-4 py-1 font-semibold">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="px-3 py-1 hover:bg-gray-100 border-l border-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;