import React, { Suspense } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import GenderProducts from "../../../components/GenderProducts";
import { SpinnerCustom } from "@/components/ui/spinner";

export const revalidate = 120;

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold my-8">Men&apos;s Collection</h1>
      <Suspense fallback={<SpinnerCustom />}>
        <GenderProducts gender="Men" />
      </Suspense>
    </div>
  );
};

export default Page;
