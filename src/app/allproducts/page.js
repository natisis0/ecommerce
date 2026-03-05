import Breadcrumb from "../../../components/Breadcrumb";
import Allproducts from "../../../components/Allproducts";
import { Suspense } from "react";
import { SpinnerCustom } from "@/components/ui/spinner";

export const revalidate = 120;

const Page = () => {


  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold my-8">All Products</h1>
      <Suspense fallback={<SpinnerCustom />}>
        <Allproducts />
      </Suspense>
    </div>
  );
};

export default Page;
