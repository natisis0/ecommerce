import Breadcrumb from "../../../components/Breadcrumb";
import Allproducts from "../../../components/Allproducts";
import { Suspense } from "react";
import { SpinnerCustom } from "@/components/ui/spinner";

export const revalidate = 120;

const Page = () => {

  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div className="mt-8">
        <Suspense fallback={<SpinnerCustom />}>
          <Allproducts title="All Products" />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
