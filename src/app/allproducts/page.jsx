
import Breadcrumb from "../../../components/Breadcrumb";
import { getShuffledProducts } from "../../../data/allProduct";
import Card from "../../../components/Card";

const Page = () => {
  const shuffledProducts = getShuffledProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold my-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {shuffledProducts.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Page;