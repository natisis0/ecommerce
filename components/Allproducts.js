import { getAllProducts } from "@/_lib/data-service";
import Card from "./Card";
import getShuffledProducts from "@/_utils/shuffleProducts";
import MapProducts from "./MapProducts";



export default async function Allproducts() {
  const products = (await getAllProducts()) || [];
  
  const shuffledProducts = getShuffledProducts(products);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <MapProducts products={shuffledProducts} />
    </div>
  );
}

